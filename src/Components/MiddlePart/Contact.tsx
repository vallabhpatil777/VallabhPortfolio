import { useRef, useState, type FormEvent } from 'react'
import SectionHeading from '../common/SectionHeading'

// EmailJS public identifiers are safe in client code by design, but reading them
// from the environment keeps the values configurable per deployment.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'service_v43r0ei'
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'template_kx8jygh'
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'TXBKoDbbNEyQNtYgs'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const fieldClass =
  'w-full rounded-md border border-gray-600 bg-transparent p-3 text-white placeholder:text-gray-500 ' +
  'transition-colors focus:border-brand-500 focus:outline-none focus-visible:outline-none'

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  const sendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = formRef.current
    if (!form || status === 'sending') return

    setStatus('sending')
    try {
      // Loaded on submit rather than on page load — the SDK is only ever needed
      // by visitors who actually send a message.
      const { default: emailjs } = await import('@emailjs/browser')
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, { publicKey: PUBLIC_KEY })
      form.reset()
      setStatus('sent')
    } catch (error) {
      console.error('Contact form submission failed:', error)
      setStatus('error')
    }
  }

  return (
    <div className="container-page">
      <SectionHeading
        title="Contact Me"
        subtitle="Feel free to reach out to me for any questions or to discuss any work opportunities."
      />

      <form
        ref={formRef}
        onSubmit={sendEmail}
        noValidate={false}
        className="surface-card mx-auto mt-10 flex w-full max-w-[700px] flex-col gap-4 p-5 sm:p-8"
      >
        <h3 className="font-sans text-xl font-semibold text-white sm:text-2xl">Email Me 📨</h3>

        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm text-gray-300">
            Your Name
          </label>
          <input
            id="contact-name"
            name="from_name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm text-gray-300">
            Your Email
          </label>
          <input
            id="contact-email"
            name="from_email"
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
          <label htmlFor="contact-message" className="mb-1 block text-sm text-gray-300">
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

        <button type="submit" disabled={status === 'sending'} className="btn-primary mt-2">
          {status === 'sending' ? 'Sending…' : 'Send Email'}
        </button>

        {/* Replaces the blocking `alert()` — announced to screen readers, and it
            does not steal focus or freeze the page. */}
        <p
          role="status"
          aria-live="polite"
          className={`min-h-[1.25rem] text-sm ${
            status === 'error' ? 'text-red-400' : 'text-green-400'
          }`}
        >
          {status === 'sent' && 'Thanks — your message has been sent.'}
          {status === 'error' &&
            'Something went wrong sending your message. Please email me directly instead.'}
        </p>
      </form>
    </div>
  )
}
