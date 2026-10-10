import { Search, X } from 'lucide-react'
import { STATUSES, URGENCIES } from '../utils/constants'

function Chips({ label, value, onChange, options }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {[{ value: '', label: 'Tous' }, ...options].map((o) => {
          const active = value === o.value
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors duration-150 ${
                active
                  ? 'border-ink bg-ink text-white'
                  : 'border-line bg-paper text-ink-soft hover:border-ink-soft hover:text-ink'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

const toOptions = (map) => Object.entries(map).map(([value, { label }]) => ({ value, label }))

export default function IssueFilters({ filters, onChange, onReset }) {
  const set = (key) => (value) => onChange({ ...filters, [key]: value })
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="card space-y-5 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="q" className="mb-1.5 block text-sm font-medium">
            Titre du problème
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <input
              id="q"
              value={filters.q}
              onChange={(e) => set('q')(e.target.value)}
              maxLength={100}
              placeholder="Rechercher un titre"
              className="field pl-9"
            />
          </div>
        </div>
        <div>
          <label htmlFor="device" className="mb-1.5 block text-sm font-medium">
            Appareil ou site
          </label>
          <input
            id="device"
            value={filters.device}
            onChange={(e) => set('device')(e.target.value)}
            maxLength={100}
            placeholder="Ordinateur 01, site de démonstration..."
            className="field"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <Chips label="Urgence" value={filters.urgency} onChange={set('urgency')} options={toOptions(URGENCIES)} />
          <Chips label="État" value={filters.status} onChange={set('status')} options={toOptions(STATUSES)} />
        </div>
        {hasFilters && (
          <button onClick={onReset} className="btn-secondary animate-fade">
            <X className="h-4 w-4" aria-hidden="true" />
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  )
}