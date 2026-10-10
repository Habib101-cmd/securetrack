import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { api } from '../api/client'
import { listIssues } from '../api/issues'
import { useAuth } from '../context/AuthContext'
import { useCountUp } from '../hooks/useCountUp'
import PageHeader from '../components/PageHeader'
import Skeleton from '../components/Skeleton'
import { formatDate, isOverdue } from '../utils/dates'

const SEGMENTS = [
  { key: 'a_traiter', label: 'À traiter', color: 'bg-ink-soft' },
  { key: 'en_cours', label: 'En cours', color: 'bg-tide' },
  { key: 'corrige', label: 'Corrigés', color: 'bg-sage' },
]

function Metric({ label, value, color }) {
  const shown = useCountUp(value)
  return (
    <div>
      <p className="flex items-center gap-2 text-sm text-ink-soft">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 font-display text-4xl font-semibold tabular-nums">{shown}</p>
    </div>
  )
}

function Overview({ stats }) {
  const [ready, setReady] = useState(false)
  const total = stats.a_traiter + stats.en_cours + stats.corrige

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="card p-6 lg:col-span-2">
      <h2 className="text-lg font-semibold">Avancement</h2>
      <p className="mt-0.5 text-sm text-ink-soft">Répartition des problèmes selon leur état.</p>

      <div
        role="img"
        aria-label={`À traiter : ${stats.a_traiter}. En cours : ${stats.en_cours}. Corrigés : ${stats.corrige}.`}
        className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-mist"
      >
        {SEGMENTS.map((s) => (
          <div
            key={s.key}
            className={`${s.color} transition-[width] duration-1000 ease-out`}
            style={{ width: ready && total ? `${(stats[s.key] / total) * 100}%` : '0%' }}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {SEGMENTS.map((s) => (
          <Metric key={s.key} label={s.label} value={stats[s.key]} color={s.color} />
        ))}
      </div>
    </section>
  )
}

function Priority() {
  const { data, isLoading } = useQuery({
    queryKey: ['issues', 'priority'],
    queryFn: () => listIssues({ urgency: 'elevee', status: 'a_traiter' }),
  })

  return (
    <section className="card p-6 lg:col-span-3">
      <h2 className="text-lg font-semibold">À traiter en priorité</h2>
      <p className="mt-0.5 text-sm text-ink-soft">Urgence élevée, pas encore prise en charge.</p>

      <div className="mt-4">
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        )}

        {data && data.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <CheckCircle2 className="h-8 w-8 text-sage" aria-hidden="true" />
            <p className="font-medium">Aucun problème urgent en attente</p>
            <p className="text-sm text-ink-soft">
              Les problèmes d'urgence élevée non traités apparaîtront ici.
            </p>
          </div>
        )}

        {data && data.length > 0 && (
          <ul className="divide-y divide-line">
            {data.slice(0, 5).map((issue) => {
              const overdue = isOverdue(issue)
              return (
                <li key={issue.id}>
                  <Link
                    to={`/issues/${issue.id}`}
                    className="group relative flex items-center justify-between gap-4 py-3.5 pl-4 pr-2 transition-colors hover:bg-mist/60"
                  >
                    <span aria-hidden="true" className="absolute inset-y-2 left-0 w-1 rounded-full bg-alert" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{issue.title}</span>
                      <span className="block truncate text-sm text-ink-soft">{issue.device}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-sm">
                      <span className={overdue ? 'font-semibold text-alert-ink' : 'text-ink-soft'}>
                        {overdue ? 'En retard' : formatDate(issue.due_date)}
                      </span>
                      <ChevronRight
                        className="h-4 w-4 text-ink-soft transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api('/issues/stats/'),
  })

  const open = stats ? stats.a_traiter + stats.en_cours : null
  const scope = user.role === 'technicien' ? 'qui vous sont attribués' : 'dans l\u2019équipe'
  const description =
    open === null
      ? 'Chargement des chiffres'
      : open === 0
        ? 'Aucun problème ouvert pour le moment.'
        : `${open} problème${open > 1 ? 's' : ''} ouvert${open > 1 ? 's' : ''} ${scope}.`

  return (
    <div>
      <PageHeader title={`Bonjour ${user.first_name}`} description={description} />

      {isLoading && (
        <div className="grid gap-6 lg:grid-cols-5">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64 lg:col-span-3" />
        </div>
      )}

      {isError && <p className="card p-5 text-alert-ink">Les statistiques n'ont pas pu être chargées.</p>}

      {stats && (
        <div className="grid gap-6 lg:grid-cols-5">
          <Overview stats={stats} />
          <Priority />
        </div>
      )}
    </div>
  )
}