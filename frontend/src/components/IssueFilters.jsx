import { STATUSES, URGENCIES } from '../utils/constants'

export default function IssueFilters({ filters, onChange, onReset }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })

  return (
    <div className="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
      <div>
        <label htmlFor="q" className="block text-xs font-medium mb-1">
          Recherche (titre)
        </label>
        <input
          id="q"
          value={filters.q}
          onChange={set('q')}
          maxLength={100}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label htmlFor="device" className="block text-xs font-medium mb-1">
          Appareil ou site
        </label>
        <input
          id="device"
          value={filters.device}
          onChange={set('device')}
          maxLength={100}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label htmlFor="urgency" className="block text-xs font-medium mb-1">
          Urgence
        </label>
        <select
          id="urgency"
          value={filters.urgency}
          onChange={set('urgency')}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Toutes</option>
          {Object.entries(URGENCIES).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-xs font-medium mb-1">
          État
        </label>
        <select
          id="status"
          value={filters.status}
          onChange={set('status')}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Tous</option>
          {Object.entries(STATUSES).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button onClick={onReset} className="border rounded px-3 py-1 hover:bg-slate-100">
        Réinitialiser
      </button>
    </div>
  )
}