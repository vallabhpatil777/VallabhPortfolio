import { ASSISTANT_SYSTEM_PROMPT } from '../../src/data/assistantPrompt.ts'

/**
 * Server-side proxy for the portfolio assistant.
 *
 * Why this exists: the browser used to call Groq directly with a `VITE_`-prefixed
 * key, which Vite compiles into the client bundle — anyone could read it out of
 * `assets/Chatbot-*.js`. The key now lives in `GROQ_API_KEY` (no `VITE_` prefix,
 * so it is never exposed to the bundle) and only this function ever sees it.
 *
 * Netlify Functions v2: the `config.path` below serves this at POST /api/chat on
 * the same origin as the site, so no CORS headers are needed or wanted.
 */
export const config = { path: '/api/chat' }

// Declared rather than pulled in from @types/node: this is the only Node API the
// function touches, and adding node types to the project would change what
// `setTimeout` returns in the React code.
declare const process: { env: Record<string, string | undefined> }

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Candidate models, best first. Groq retires ids without notice — that is what
 * took the assistant down when `llama-3.3-70b-versatile` was decommissioned and
 * every request started coming back 404. A retired head of this list now falls
 * through to the next entry instead of taking the widget offline.
 *
 * Check the list against `GET https://api.groq.com/openai/v1/models` if the
 * assistant ever starts failing again.
 */
const MODELS: { id: string; params?: Record<string, unknown> }[] = [
  { id: 'openai/gpt-oss-120b', params: { reasoning_effort: 'low' } },
  { id: 'openai/gpt-oss-20b', params: { reasoning_effort: 'low' } },
  { id: 'qwen/qwen3.8-27b' },
]

/** Netlify caps a synchronous function at 10s, so leave headroom to answer. */
const BUDGET_MS = 8_000

const MAX_TURNS = 20
const MAX_CHARS_PER_TURN = 2_000
const MAX_CHARS_TOTAL = 20_000

type Turn = { role: 'user' | 'assistant'; content: string }

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

/**
 * Browsers send `Origin` on every POST, same-origin included, so this rejects
 * other sites embedding the endpoint. It is a speed bump, not a security
 * boundary — a plain `curl` sends no Origin at all — which is why the payload
 * limits below matter more.
 */
function originAllowed(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true

  // Netlify sets these; DEPLOY_PRIME_URL and DEPLOY_URL cover branch/preview deploys.
  const allowed = [process.env.URL, process.env.DEPLOY_PRIME_URL, process.env.DEPLOY_URL]
    .filter((value): value is string => Boolean(value))

  if (allowed.includes(origin)) return true
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
}

/**
 * The caller supplies conversation turns only. The system prompt is injected
 * below rather than accepted from the request — otherwise this endpoint is a
 * free, key-funded LLM for anyone who finds it in the network tab.
 */
function readTurns(payload: unknown): Turn[] | null {
  if (typeof payload !== 'object' || payload === null) return null

  const { messages } = payload as { messages?: unknown }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_TURNS) return null

  const turns: Turn[] = []
  let total = 0

  for (const raw of messages) {
    if (typeof raw !== 'object' || raw === null) return null
    const { role, content } = raw as { role?: unknown; content?: unknown }

    if (role !== 'user' && role !== 'assistant') return null
    if (typeof content !== 'string') return null

    const trimmed = content.trim()
    if (!trimmed || trimmed.length > MAX_CHARS_PER_TURN) return null

    total += trimmed.length
    if (total > MAX_CHARS_TOTAL) return null

    turns.push({ role, content: trimmed })
  }

  return turns
}

/** A response meaning "this model id is no longer served" — try the next one. */
function isModelGone(status: number, detail: string): boolean {
  if (status === 404) return true
  // Groq also answers 400 with `model_decommissioned` for retired ids.
  return status === 400 && /model_(not_found|decommissioned)|does not exist/i.test(detail)
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)
  if (!originAllowed(request)) return json({ error: 'forbidden' }, 403)

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.error('GROQ_API_KEY is not set on this deploy.')
    return json({ error: 'not_configured' }, 503)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'bad_request' }, 400)
  }

  const turns = readTurns(payload)
  if (!turns) return json({ error: 'bad_request' }, 400)

  const messages = [{ role: 'system', content: ASSISTANT_SYSTEM_PROMPT }, ...turns]
  const deadline = Date.now() + BUDGET_MS
  let lastDetail = 'no attempt was made'

  for (const model of MODELS) {
    const remaining = deadline - Date.now()
    if (remaining <= 500) break

    let response: Response
    try {
      response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        signal: AbortSignal.timeout(remaining),
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model.id,
          messages,
          temperature: 0.4,
          max_tokens: 1024,
          ...model.params,
        }),
      })
    } catch (caught) {
      lastDetail = `${model.id} -> ${String(caught)}`
      continue
    }

    if (response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { choices?: { message?: { content?: string } }[] }
        | null
      const reply = data?.choices?.[0]?.message?.content
      if (typeof reply === 'string' && reply.trim()) return json({ reply }, 200)
      lastDetail = `${model.id} -> empty completion`
      continue
    }

    const detail = await response.text().catch(() => '')
    lastDetail = `${model.id} -> ${response.status} ${detail.slice(0, 200)}`

    // Upstream detail is logged, never returned: it can echo request headers.
    if (response.status === 401 || response.status === 403) {
      console.error('Groq rejected the API key.', lastDetail)
      return json({ error: 'auth' }, 502)
    }
    if (response.status === 429) {
      console.warn('Groq rate limit hit.', lastDetail)
      return json({ error: 'rate_limited' }, 429)
    }
    if (isModelGone(response.status, detail)) {
      console.warn(`Groq model "${model.id}" is unavailable — falling back.`, lastDetail)
      continue
    }

    console.error('Groq request failed.', lastDetail)
    return json({ error: 'upstream' }, 502)
  }

  console.error('No Groq model answered.', lastDetail)
  return json({ error: 'upstream' }, 502)
}
