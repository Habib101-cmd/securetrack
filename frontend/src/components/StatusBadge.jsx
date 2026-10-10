import { STATUSES } from '../utils/constants'

export default function StatusBadge({ value, animate = false }) {
  const s = STATUSES[value] ?? { label: value, dot: 'bg-ink-soft', text: 'text-ink', soft: 'bg-line/60' }
  return (
    <span
      key={value}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.soft} ${s.text} ${animate ? 'animate-pop' : ''}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  )
}