import { ArrowRight } from 'lucide-react'
import { STATUSES, URGENCIES } from '../utils/constants'
import { formatDateTime } from '../utils/dates'

const FIELD_LABELS = {
  status: "l'état",
  urgency: "l'urgence",
  assignee: 'le responsable',
  title: 'le titre',
  description: 'la description',
  device: "l'appareil",
  due_date: "l'échéance",
}

function format(field, value) {
  if (field === 'status') return STATUSES[value]?.label ?? value
  if (field === 'urgency') return URGENCIES[value]?.label ?? value
  return value || '-'
}

export default function HistoryList({ history }) {
  if (history.length === 0) {
    return <p className="text-sm text-ink-soft">Aucune modification enregistrée.</p>
  }

  return (
    <ol className="relative space-y-5 border-l border-line pl-5">
      {history.map((h) => (
        <li key={h.id} className="relative text-sm">
          <span
            aria-hidden="true"
            className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-ink-soft"
          />
          <p>
            <span className="font-medium">{h.user}</span> a modifié {FIELD_LABELS[h.field] ?? h.field}
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <span className="text-ink-soft">{format(h.field, h.old_value)}</span>
            <ArrowRight className="h-3.5 w-3.5 text-ink-soft" aria-hidden="true" />
            <span className="font-medium">{format(h.field, h.new_value)}</span>
          </p>
          <time dateTime={h.created_at} className="mt-0.5 block text-xs text-ink-soft">
            {formatDateTime(h.created_at)}
          </time>
        </li>
      ))}
    </ol>
  )
}