import { STATUSES } from '../utils/constants'

export default function StatusBadge({ value }) {
  const s = STATUSES[value] ?? { label: value, classes: 'bg-slate-100 text-slate-800' }
  return <span className={`px-2 py-1 rounded text-xs font-medium ${s.classes}`}>{s.label}</span>
}
