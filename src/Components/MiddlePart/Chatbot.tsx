import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MarkdownIt from 'markdown-it'
import chatIcon from '../../assets/chatbot.svg'
import { MissingApiKeyError, sendChat, type ChatMessage } from '../lib/groqClient'
import { ASSISTANT_SYSTEM_PROMPT } from '../../data/assistantPrompt'

const GREETING = "Hello! I'm Vallabh's assistant — ask me about his experience, skills or projects."

type Bubble = { id: number; role: 'user' | 'assistant'; content: string }

let nextId = 0

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [messages, setMessages] = useState<Bubble[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // `html: false` means any HTML in the model's reply is escaped rather than
  // injected, which is what makes the render below safe.
  const md = useMemo(
    () => new MarkdownIt({ html: false, linkify: true, breaks: true }),
    [],
  )

  // Abort any in-flight request if the widget unmounts.
  useEffect(() => () => abortRef.current?.abort(), [])

  // The hint has done its job after a few seconds; leaving it up permanently just
  // covers the content behind it.
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  // Keep the newest message in view.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, isSending])

  const closeChat = useCallback(() => {
    setIsOpen(false)
    toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChat()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeChat])

  const openChat = () => {
    setShowHint(false)
    setIsOpen(true)
    setMessages((current) =>
      current.length > 0
        ? current
        : [{ id: nextId++, role: 'assistant', content: GREETING }],
    )
  }

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isSending) return

    const outgoing: Bubble = { id: nextId++, role: 'user', content: trimmed }
    // Capture the history *before* the state update so the request body matches
    // what the user can see.
    const history: ChatMessage[] = [
      { role: 'system', content: ASSISTANT_SYSTEM_PROMPT },
      ...messages
        .filter((message) => message.content !== GREETING)
        .map(({ role, content }) => ({ role, content }) as ChatMessage),
      { role: 'user', content: trimmed },
    ]

    setMessages((current) => [...current, outgoing])
    setInput('')
    setError(null)
    setIsSending(true)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const reply = await sendChat(history, controller.signal)
      setMessages((current) => [...current, { id: nextId++, role: 'assistant', content: reply }])
    } catch (caught) {
      if (controller.signal.aborted) return
      console.error('Chat request failed:', caught)
      setError(
        caught instanceof MissingApiKeyError
          ? 'The assistant is not configured on this deployment. Please use the contact form instead.'
          : 'Sorry — I could not reach the assistant. Please try again in a moment.',
      )
    } finally {
      if (!controller.signal.aborted) setIsSending(false)
    }
  }

  return (
    <>
      {/* Launcher. The previous version wrapped this in an invisible 500x100
          fixed div pinned to the top-left, which silently swallowed clicks on
          whatever sat underneath it. */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 sm:bottom-6 sm:right-6">
        {showHint && !isOpen && (
          <span className="hidden rounded-lg border border-brand-500 bg-brand-500 px-3 py-2 text-sm text-white shadow-lg sm:block">
            How may I help you?
          </span>
        )}
        {/* Original styling: the icon artwork alone, no coloured circle behind it. */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => (isOpen ? closeChat() : openChat())}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
          className="rounded-full p-4 text-white transition-all duration-300 ease-in-out hover:opacity-80 lg:p-6"
        >
          <img src={chatIcon} alt="" width={48} height={48} className="h-12 w-12" />
        </button>
      </div>

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Chat with Vallabh's assistant"
          // Sized off the viewport rather than a fixed pixel width, so it fits a
          // 320px phone and never overflows the screen.
          className="fixed bottom-24 right-4 z-40 flex max-h-[min(70dvh,32rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-hairline shadow-2xl sm:bottom-28 sm:right-6"
        >
          <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-3 text-white">
            <h2 className="text-base font-semibold">Chat with Me</h2>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
              className="grid h-8 w-8 place-items-center rounded-full text-lg transition hover:bg-white/20"
            >
              ✕
            </button>
          </div>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-atomic="false"
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-gray-900 p-4"
          >
            {messages.map((message) =>
              message.role === 'user' ? (
                <p
                  key={message.id}
                  className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-white px-3 py-2 text-sm text-gray-900"
                >
                  {message.content}
                </p>
              ) : (
                <div
                  key={message.id}
                  className="prose-chat mr-auto w-fit max-w-[90%] break-words rounded-2xl rounded-bl-sm bg-brand-500 px-3 py-2 text-sm text-white"
                  // Safe: the renderer is configured with `html: false`, so the
                  // model's output cannot inject markup.
                  dangerouslySetInnerHTML={{ __html: md.render(message.content) }}
                />
              ),
            )}

            {isSending && (
              <p className="mr-auto flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-brand-500 px-3 py-3">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    style={{ animationDelay: `${delay}ms` }}
                    className="h-2 w-2 animate-bounce rounded-full bg-white/80"
                  />
                ))}
                <span className="sr-only">Assistant is typing…</span>
              </p>
            )}

            {error && (
              <p role="alert" className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              void handleSend()
            }}
            className="flex items-center gap-2 border-t border-hairline bg-gray-800 p-2"
          >
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message…"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-lg bg-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-r from-brand-500 to-brand-700 text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  )
}
