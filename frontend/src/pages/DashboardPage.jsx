import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

const CARDS = [
  { key: 'a_traiter', label: 'À traiter' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'corrige', label: 'Corrigés' },
]

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api('/issues/stats/'),
  })

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Tableau de bord</h1>
      {isLoading && <p>Chargement…</p>}
      {error && <p className="text-red-700">Impossible de charger les statistiques.</p>}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CARDS.map((c) => (
            <div key={c.key} className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-slate-500">{c.label}</p>
              <p className="text-3xl font-bold">{data[c.key]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}