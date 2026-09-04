type Props = {
  title: string
  subtitle?: string
}

export default function SectionHeading({ title, subtitle }: Props) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle mt-4">{subtitle}</p>}
    </header>
  )
}
