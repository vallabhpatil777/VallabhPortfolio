const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export class MissingApiKeyError extends Error {
  constructor() {
    super('VITE_GROQ_API_KEY is not configured.')
    this.name = 'MissingApiKeyError'
  }
}

/**
 * Minimal Groq chat client.
 *
 * This replaces `@langchain/groq`, which pulled the whole LangChain runtime
 * (plus langsmith tracing) into the bundle to issue a single chat completion.
 * Groq speaks the OpenAI-compatible protocol, so one `fetch` covers it.
 *
 * Note: the key is a `VITE_`-prefixed variable, which means it is embedded in the
 * client bundle and readable by anyone who opens devtools. That is inherent to
 * calling Groq straight from the browser — for anything beyond a personal demo,
 * proxy this through a small serverless function that holds the key.
 */
export async function sendChat(
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<string> {
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
      model: MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Groq request failed (${response.status}): ${detail.slice(0, 200)}`)
  }

  const data: { choices?: { message?: { content?: string } }[] } = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Groq returned an empty response.')
  return content
}
