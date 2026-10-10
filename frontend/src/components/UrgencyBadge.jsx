import { URGENCIES } from '../utils/constants'

export default function UrgencyBadge({ value }) {
  const u = URGENCIES[value] ?? { label: value, dot: 'bg-ink-soft', text: 'text-ink', soft: 'bg-line/60' }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${u.soft} ${u.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${u.dot}`} aria-hidden="true" />
      {u.label}
    </span>
  )
}