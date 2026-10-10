import { URGENCIES } from '../utils/constants'

export default function UrgencyBadge({ value }) {
  const u = URGENCIES[value] ?? { label: value, classes: 'bg-slate-100 text-slate-800' }
  return <span className={`px-2 py-1 rounded text-xs font-medium ${u.classes}`}>{u.label}</span>
}