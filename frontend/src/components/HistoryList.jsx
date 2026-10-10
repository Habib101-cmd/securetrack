import { STATUSES, URGENCIES } from '../utils/constants'

const FIELD_LABELS = {
  status: 'État',
  urgency: 'Urgence',
  assignee: 'Responsable',
  title: 'Titre',
  description: 'Description',
  device: 'Appareil',
  due_date: 'Échéance',
}

function format(field, value) {
  if (field === 'status') return STATUSES[value]?.label ?? value
  if (field === 'urgency') return URGENCIES[value]?.label ?? value
  return value || '-'
}

export default function HistoryList({ history }) {
  if (history.length === 0) {
    return <p className="text-sm text-slate-500">Aucune modification enregistrée.</p>
  }

  return (
    <ul className="space-y-2 text-sm">
      {history.map((h) => (
        <li key={h.id} className="border-l-4 border-slate-300 pl-3">
          <span className="font-medium">{h.user}</span> a modifié{' '}
          <span className="font-medium">{FIELD_LABELS[h.field] ?? h.field}</span> :{' '}
          {format(h.field, h.old_value)} → {format(h.field, h.new_value)}
          <span className="block text-xs text-slate-500">
            {new Date(h.created_at).toLocaleString('fr-FR')}
          </span>
        </li>
      ))}
    </ul>
  )
}