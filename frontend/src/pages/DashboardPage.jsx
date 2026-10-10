import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

const CARDS = [
  { key: 'a_traiter', label: 'À traiter' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'corrige', label: 'Corrigés' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api('/issues/stats/'),
  })

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-slate-800">SecureTrack</span>
        <div className="flex items-center gap-4 text-sm">
          <span>
            {user.first_name} ({user.role})
          </span>
          <button onClick={logout} className="text-red-700 hover:underline">
            Se déconnecter
          </button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">Tableau de bord</h1>
        {isLoading && <p>Chargement…</p>}
        {error && <p className="text-red-700">Impossible de charger les statistiques.</p>}
        {data && (
          <div className="grid grid-cols-3 gap-4">
            {CARDS.map((c) => (
              <div key={c.key} className="bg-white rounded-xl shadow p-5">
                <p className="text-sm text-slate-500">{c.label}</p>
                <p className="text-3xl font-bold">{data[c.key]}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}