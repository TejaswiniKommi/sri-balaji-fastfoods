import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-55 active:scale-[.98]'

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-card',
  accent: 'bg-sun-400 text-ink hover:bg-sun-300 shadow-card',
  light: 'bg-white text-brand-700 hover:bg-brand-50 shadow-card',
  outline: 'border-2 border-brand-600 text-brand-700 hover:bg-brand-50',
  outlineLight: 'border-2 border-white/80 text-white hover:bg-white/10',
  ghost: 'text-ink-soft hover:bg-cream-200',
  success: 'bg-leaf-600 text-white hover:bg-leaf-700',
  danger: 'bg-red-700 text-white hover:bg-red-800',
}

const sizes = {
  sm: 'min-h-11 px-3.5 text-sm',
  md: 'min-h-12 px-5 text-base',
  lg: 'min-h-14 px-7 text-lg',
}

/** Renders a <Link> when `to` is given, an <a> when `href` is given, otherwise a <button>. */
export default function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...props }) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>
  if (href) return <a href={href} className={classes} {...props}>{children}</a>
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
