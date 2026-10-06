import { Link } from 'react-router-dom'

/** Simple logo treatment: "SB" badge + wordmark. */
export default function Logo({ inverted = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600" aria-label="Sri Balaji Fastfoods, home">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 font-display text-xl font-extrabold text-sun-300 ring-2 ring-sun-400">
        SB
      </span>
      <span className={`font-display text-xl font-extrabold leading-none sm:text-2xl ${inverted ? 'text-white' : 'text-ink'}`}>
        Sri Balaji Fastfoods
      </span>
    </Link>
  )
}
