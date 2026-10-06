export default function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-xl text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
