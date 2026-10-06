import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { CONTACT } from '../../data/config'

const SOON = <span className="text-ink-muted">Coming soon</span>

/** Reads from data/config.js → CONTACT. Empty fields show "Coming soon" instead of made-up details. */
export default function ContactInfo({ className = '' }) {
  const rows = [
    {
      icon: Phone,
      label: 'Phone',
      value: CONTACT.phone ? <a className="font-bold text-brand-700 hover:underline" href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a> : SOON,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: CONTACT.whatsapp ? (
        <a className="font-bold text-brand-700 hover:underline" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer">
          Message us on WhatsApp
        </a>
      ) : (
        SOON
      ),
    },
    {
      icon: MapPin,
      label: 'Address',
      value: CONTACT.address ? (
        <span>
          {CONTACT.address}
          {CONTACT.mapUrl && (
            <>
              {' '}
              <a className="font-bold text-brand-700 hover:underline" href={CONTACT.mapUrl} target="_blank" rel="noreferrer">
                Open in Maps
              </a>
            </>
          )}
        </span>
      ) : (
        SOON
      ),
    },
    { icon: Clock, label: 'Opening hours', value: CONTACT.hours || SOON },
  ]

  return (
    <dl className={`grid gap-4 ${className}`}>
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sun-100 text-brand-700">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <dt className="text-sm font-bold text-ink-soft">{label}</dt>
            <dd className="text-base text-ink">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
