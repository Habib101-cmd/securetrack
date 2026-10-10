import { useState } from 'react'
import { Link } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { listIssues } from '../api/issues'
import { useAuth } from '../context/AuthContext'
import { useDebounce } from '../hooks/useDebounce'
import IssueFilters from '../components/IssueFilters'
import IssueTable from '../components/IssueTable'
import PageHeader from '../components/PageHeader'
import Skeleton from '../components/Skeleton'

const EMPTY = { q: '', device: '', urgency: '', status: '' }

export default function IssuesListPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState(EMPTY)
  const debounced = useDebounce(filters)
  const canCreate = user.role === 'analyste' || user.role === 'admin'

  const { data, isLoading, isError, isPlaceholderData, refetch } = useQuery({
    queryKey: ['issues', debounced],
    queryFn: () => listIssues(debounced),
    placeholderData: keepPreviousData,
  })

  const count = data?.length ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Problèmes"
        description={data ? `${count} problème${count > 1 ? 's' : ''} affiché${count > 1 ? 's' : ''}` : 'Chargement de la liste'}
        action={
          canCreate && (
            <Link to="/issues/new" className="btn-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter un problème
            </Link>
          )
        }
      />

      <IssueFilters filters={filters} onChange={setFilters} onReset={() => setFilters(EMPTY)} />

      {isLoading && (
        <div className="card space-y-3 p-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      )}

      {isError && (
        <div className="card flex items-center justify-between gap-4 p-5">
          <p className="text-alert-ink">La liste n'a pas pu être chargée.</p>
          <button onClick={() => refetch()} className="btn-secondary">Réessayer</button>
        </div>
      )}

      {data && <IssueTable issues={data} dimmed={isPlaceholderData} />}
    </div>
  )
}