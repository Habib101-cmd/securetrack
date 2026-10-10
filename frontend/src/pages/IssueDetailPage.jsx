import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addComment, getIssue, updateIssue } from '../api/issues'
import { useAuth } from '../context/AuthContext'
import CommentList from '../components/CommentList'
import HistoryList from '../components/HistoryList'
import StatusBadge from '../components/StatusBadge'
import UrgencyBadge from '../components/UrgencyBadge'
import { STATUSES } from '../utils/constants'

export default function IssueDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')

  const { data: issue, isLoading, error } = useQuery({
    queryKey: ['issue', id],
    queryFn: () => getIssue(id),
    retry: false,
  })

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['issue', id] })
    queryClient.invalidateQueries({ queryKey: ['issues'] })
    queryClient.invalidateQueries({ queryKey: ['stats'] })
  }

  const statusMutation = useMutation({
    mutationFn: (status) => updateIssue(id, { status }),
    onSuccess: () => {
      setMessage('')
      refresh()
    },
    onError: (e) =>
      setMessage(
        e.status === 403
          ? "Vous n'avez pas le droit de modifier ce problème."
          : "Impossible de modifier l'état."
      ),
  })

  const commentMutation = useMutation({
    mutationFn: (content) => addComment(id, content),
    onSuccess: () => {
      setComment('')
      setMessage('')
      refresh()
    },
    onError: () => setMessage("Impossible d'ajouter le commentaire."),
  })

  if (isLoading) return <p>Chargement…</p>
  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-red-700">
          {error.status === 404 ? 'Problème introuvable.' : 'Impossible de charger le problème.'}
        </p>
        <Link to="/issues" className="text-blue-700 hover:underline">
          Retour à la liste
        </Link>
      </div>
    )
  }

  // Un technicien ne choisit pas « Rejeté » (réservé à l'analyse)
  const statusOptions = Object.entries(STATUSES).filter(
    ([value]) => user.role !== 'technicien' || value !== 'rejete'
  )

  const submitComment = (e) => {
    e.preventDefault()
    const content = comment.trim()
    if (!content) {
      setMessage('Le commentaire ne peut pas être vide.')
      return
    }
    commentMutation.mutate(content)
  }

  return (
    <div className="space-y-6">
      <Link to="/issues" className="text-sm text-blue-700 hover:underline">
        ← Retour à la liste
      </Link>

      {message && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 p-2 rounded">
          {message}
        </p>
      )}

      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{issue.title}</h1>
          <div className="flex items-center gap-2">
            <UrgencyBadge value={issue.urgency} />
            <StatusBadge value={issue.status} />
          </div>
        </div>

        <p className="whitespace-pre-wrap text-slate-700">{issue.description}</p>

        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">Appareil ou site</dt>
            <dd>{issue.device}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Responsable</dt>
            <dd>{issue.assignee_name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Signalé par</dt>
            <dd>{issue.author_name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Échéance</dt>
            <dd>{issue.due_date ?? '-'}</dd>
          </div>
        </dl>

        <div className="border-t pt-4">
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Modifier l'état
          </label>
          <select
            id="status"
            value={issue.status}
            disabled={statusMutation.isPending}
            onChange={(e) => statusMutation.mutate(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {statusOptions.map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="font-semibold">Commentaires</h2>
        <CommentList comments={issue.comments} />

        <form onSubmit={submitComment} className="space-y-2" noValidate>
          <label htmlFor="comment" className="block text-sm font-medium">
            Ajouter un commentaire
          </label>
          <textarea
            id="comment"
            rows={3}
            maxLength={1000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Exemple : Mise à jour installée le 9 octobre"
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={commentMutation.isPending}
            className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-700 disabled:opacity-50"
          >
            {commentMutation.isPending ? 'Envoi…' : 'Commenter'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-xl shadow p-6 space-y-3">
        <h2 className="font-semibold">Historique des modifications</h2>
        <HistoryList history={issue.history} />
      </section>
    </div>
  )
}