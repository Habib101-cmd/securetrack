import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listIssues } from '../api/issues'
import IssueFilters from '../components/IssueFilters'
import IssueTable from '../components/IssueTable'
import { useDebounce } from '../hooks/useDebounce'

const EMPTY = { q: '', device: '', urgency: '', status: '' }

export default function IssuesListPage() {
  const [filters, setFilters] = useState(EMPTY)
  const debounced = useDebounce(filters)

  const { data, isLoading, error } = useQuery({
    queryKey: ['issues', debounced],
    queryFn: () => listIssues(debounced),
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Liste des problèmes</h1>
      <IssueFilters filters={filters} onChange={setFilters} onReset={() => setFilters(EMPTY)} />

      {isLoading && <p>Chargement…</p>}
      {error && <p className="text-red-700">Impossible de charger les problèmes.</p>}
      {data && <IssueTable issues={data} />}
    </div>
  )
}