const SIZES = { sm: 'h-6 w-6 text-xs', md: 'h-8 w-8 text-sm' }

export default function Avatar({ name = '', size = 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-tide-soft font-semibold text-tide-deep ${SIZES[size]}`}
    >
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  )
}