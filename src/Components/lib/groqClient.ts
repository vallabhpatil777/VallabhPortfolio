import { ASSISTANT_SYSTEM_PROMPT } from '../../data/assistantPrompt'

/**
 * Client for the portfolio assistant.
 *
 * In production this posts to `/api/chat`, a Netlify Function that holds the
 * Groq key server-side (`netlify/functions/chat.mts`). The browser never sees a
 * credential — which is the point: the previous version called Groq directly
 * with a `VITE_`-prefixed key, and Vite compiles those straight into the bundle
 * for anyone to read out of devtools.
 *
 * The direct-to-Groq path below exists only so `npm run dev` works without the
 * Netlify CLI. It is wrapped in `import.meta.env.DEV`, which Vite replaces with
 * `false` at build time, so the branch — and the key reference inside it — is
 * dropped from the production bundle entirely. Use `netlify dev` to exercise the
 * real function locally.
 */
const CHAT_ENDPOINT = '/api/chat'
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

/** Conversation turns only. The system prompt is injected by the server. */
export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export class MissingApiKeyError extends Error {
  constructor() {
    super('The assistant backend has no GROQ_API_KEY configured.')
    this.name = 'MissingApiKeyError'
  }
}

/** The key is present but rejected — expired, revoked or mistyped. */
export class AuthError extends Error {
  constructor() {
    super('Groq rejected the API key.')
    this.name = 'AuthError'
  }
}

/** Groq returned 429, so the UI can suggest waiting rather than retrying hard. */
export class RateLimitError extends Error {
  constructor() {
    super('Groq rate limit reached.')
    this.name = 'RateLimitError'
  }
}

function errorForCode(code: unknown, status: number): Error {
  switch (code) {
    case 'not_configured':
      return new MissingApiKeyError()
    case 'auth':
      return new AuthError()
    case 'rate_limited':
      return new RateLimitError()
    default:
      return new Error(`Assistant request failed (${status}): ${String(code ?? 'unknown')}`)
  }
}

/**
 * Dev-only. Kept so the assistant works under plain `npm run dev` with a local
 * `VITE_GROQ_API_KEY`. Never reached in a production build.
 */
async function sendChatDirect(messages: ChatMessage[], signal?: AbortSignal): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new MissingApiKeyError()

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      reasoning_effort: 'low',
      messages: [{ role: 'system', content: ASSISTANT_SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new AuthError()
    if (response.status === 429) throw new RateLimitError()
    throw new Error(`Groq request failed (${response.status}).`)
  }

  const data: { choices?: { message?: { content?: string } }[] } = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Groq returned an empty response.')
  return content
}

export async function sendChat(
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<string> {
  if (import.meta.env.DEV && import.meta.env.VITE_GROQ_API_KEY) {
    return sendChatDirect(messages, signal)
  }

  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  const data = (await response.json().catch(() => null)) as
    | { reply?: string; error?: string }
    | null

  if (!response.ok) throw errorForCode(data?.error, response.status)
  if (!data?.reply) throw new Error('The assistant returned an empty response.')
  return data.reply
}
