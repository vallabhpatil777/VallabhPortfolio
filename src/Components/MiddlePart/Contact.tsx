import { useState, type FormEvent } from 'react'
import SectionHeading from '../common/SectionHeading'
import Reveal from '../common/Reveal'
import { useSpotlight } from '../../hooks/useSpotlight'

/**
 * Web3Forms, replacing EmailJS.
 *
 * The reason for the switch is not the SDK — it is the auth model. EmailJS's
 * Gmail service is OAuth-based, and Google expires the refresh token every 7
 * days while an OAuth consent screen sits in "Testing". The form had been
 * failing with `412 Gmail_API: Invalid grant` for exactly that reason. Web3Forms
 * authenticates with a static access key, so there is no grant to expire.
 *
 * The key is public by design — the same trust model the EmailJS public key had.
 * It only permits posting to this one form's configured destination address.
 */
const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? ''

/** Give up rather than leaving the button spinning forever on a dead network. */
const TIMEOUT_MS = 15_000

type Status = 'idle' | 'sending' | 'sent' | 'error'

const DIRECT_EMAIL = 'vallabhpatil777@gmail.com'

const fieldClass =
  'w-full rounded-xl border border-hairline bg-black/25 p-3 text-white placeholder:text-gray-600 ' +
  'transition-[border-color,box-shadow,background-color] duration-300 ' +
  'hover:border-white/20 focus:border-brand-500 focus:bg-black/40 focus:shadow-glow-sm ' +
  'focus:outline-none focus-visible:outline-none'

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-gray-500'

/** Direct routes, for visitors who would rather not use a form. */
const CHANNELS: { label: string; value: string; href?: string; path: string }[] = [
  {
    label: 'Email',
    value: DIRECT_EMAIL,
    href: `mailto:${DIRECT_EMAIL}`,
    path: 'M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5zm2.4-.5 7.6 5.6L19.6 6z',
  },
  {
    label: 'LinkedIn',
    value: 'in/vallabh-patil',
    href: 'https://www.linkedin.com/in/vallabh-patil-63248b144',
    path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.65h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21H9z',
  },
  {
    label: 'Based in',
    value: 'Birmingham, UK',
    path: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z',
  },
]

/** 15s abort signal, where the browser supports one. */
function timeoutSignal(): AbortSignal | undefined {
  if (typeof AbortSignal === 'undefined' || !('timeout' in AbortSignal)) return undefined
  return AbortSignal.timeout(TIMEOUT_MS)
}

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorText, setErrorText] = useState<string | null>(null)
  // One ref serves both jobs: the submit handler reads the form's fields, and
  // the spotlight needs the element to turn pointer coordinates into
  // element-relative percentages.
  const spotlight = useSpotlight<HTMLFormElement>()

  const sendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = spotlight.ref.current
    if (!form || status === 'sending') return

    if (!ACCESS_KEY) {
      // A missing key is a deployment mistake, not a network failure, so it says
      // so instead of blaming the connection.
      console.error(
        'Contact form is not configured: set VITE_WEB3FORMS_ACCESS_KEY (see .env.example).',
      )
      setErrorText('The contact form is not configured on this deployment.')
      setStatus('error')
      return
    }

    setStatus('sending')
    setErrorText(null)

    try {
      // Reading the fields off the form keeps the payload and the markup in step
      // — a renamed input cannot silently drop out of the email.
      const fields = Object.fromEntries(new FormData(form).entries())

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: timeoutSignal(),
        body: JSON.stringify({
          ...fields,
          access_key: ACCESS_KEY,
          subject: `Portfolio message from ${fields.name || 'a visitor'}`,
          from_name: 'Portfolio contact form',
        }),
      })

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null

      // Web3Forms answers 200 with `success: false` for a rejected submission,
      // so the status code alone is not enough to call this a success.
      if (!response.ok || !data?.success) {
        throw new Error(data?.message ?? `Request failed (${response.status}).`)
      }

      form.reset()
      setStatus('sent')
    } catch (error) {
      console.error('Contact form submission failed:', error)
      setErrorText(null)
      setStatus('error')
    }
  }

  return (
    <div className="container-page">
      <SectionHeading
        eyebrow="Get in touch"
        title="Contact Me"
        subtitle="Feel free to reach out to me for any questions or to discuss any work opportunities."
      />

      {/* Two columns from `lg`: the direct channels next to the form, rather than
          a lone form floating in the middle of a wide page. */}
      <div className="mx-auto mt-12 grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-start">
        <Reveal from="left" className="h-full">
          <ul className="flex h-full flex-col gap-3">
            {CHANNELS.map((channel) => {
              const body = (
                <>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d={channel.path} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
                      {channel.label}
                    </span>
                    <span className="block truncate text-sm text-white">{channel.value}</span>
                  </span>
                </>
              )

              return (
                <li key={channel.label}>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="surface-card card-lift flex items-center gap-3 p-4"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="surface-card flex items-center gap-3 p-4">{body}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </Reveal>

        <Reveal from="right" delay={80}>
          <form
            ref={spotlight.ref}
            onPointerMove={spotlight.onPointerMove}
            onSubmit={sendEmail}
            noValidate={false}
            className="surface-card spotlight flex w-full flex-col gap-5 p-5 sm:p-8"
          >
            <h3 className="font-sans text-xl font-semibold text-white sm:text-2xl">
              Email Me <span aria-hidden="true">📨</span>
            </h3>

            {/* Honeypot. Web3Forms silently discards any submission where
                `botcheck` is truthy; a human never sees this, and an unchecked
                box is simply omitted from the FormData. `tabIndex={-1}` and
                aria-hidden keep it out of the keyboard and screen-reader path. */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div>
              <label htmlFor="contact-name" className={labelClass}>
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Jane Doe"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className={labelClass}>
                Your Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                // `inputMode` gives mobile keyboards the @ key without a type change.
                inputMode="email"
                placeholder="jane@example.com"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="contact-message" className={labelClass}>
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                placeholder="Tell me about the role or project…"
                className={`${fieldClass} min-h-[140px] resize-y`}
              />
            </div>

            <button type="submit" disabled={status === 'sending'} className="btn-primary">
              {status === 'sending' ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  />
                  Sending…
                </>
              ) : (
                <>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" />
                  </svg>
                  Send Email
                </>
              )}
            </button>

            {/* Replaces the blocking `alert()` — announced to screen readers, and it
                does not steal focus or freeze the page. */}
            <p
              role="status"
              aria-live="polite"
              className={`min-h-[1.25rem] text-sm ${
                status === 'error' ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {status === 'sent' && 'Thanks — your message has been sent.'}
              {/* The fallback is a real, clickable address rather than the advice
                  to "email me directly" with no address to hand. */}
              {status === 'error' && (
                <>
                  {errorText ?? 'Something went wrong sending your message.'} Please email me
                  directly at{' '}
                  <a
                    href={`mailto:${DIRECT_EMAIL}`}
                    className="font-medium underline underline-offset-2"
                  >
                    {DIRECT_EMAIL}
                  </a>
                  .
                </>
              )}
            </p>
          </form>
        </Reveal>
      </div>
    </div>
  )
}
