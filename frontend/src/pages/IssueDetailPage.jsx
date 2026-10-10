import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CalendarClock, Check, Flag, Loader2, Monitor, Send, User } from 'lucide-react'
import { addComment, getIssue, updateIssue } from '../api/issues'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import CommentList from '../components/CommentList'
import HistoryList from '../components/HistoryList'
import Skeleton from '../components/Skeleton'
import StatusBadge from '../components/StatusBadge'
import UrgencyBadge from '../components/UrgencyBadge'
import { STATUSES, URGENCIES } from '../utils/constants'
import { formatDate, isOverdue } from '../utils/dates'

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" aria-hidden="true" />
      <div>
        <dt className="text-xs text-ink-soft">{label}</dt>
        <dd className="text-sm font-medium">{children}</dd>
      </div>
    </div>
  )
}

export default function IssueDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { notify } = useToast()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')
  const [highlight, setHighlight] = useState(null)

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
      notify('État mis à jour')
      refresh()
    },
    onError: (e) =>
      notify(
        e.status === 403
          ? "Vous n'avez pas le droit de modifier ce problème."
          : "L'état n'a pas pu être modifié. Réessayez.",
        'error'
      ),
  })

  const commentMutation = useMutation({
    mutationFn: (content) => addComment(id, content),
    onSuccess: (created) => {
      setComment('')
      setHighlight(created.id)
      notify('Commentaire ajouté')
      refresh()
    },
    onError: () => notify("Le commentaire n'a pas pu être ajouté. Réessayez.", 'error'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card space-y-3 p-8">
        <p className="font-display text-lg font-semibold">
          {error.status === 404 ? 'Problème introuvable' : 'Le problème n\u2019a pas pu être chargé'}
        </p>
        <p className="text-sm text-ink-soft">
          {error.status === 404
            ? "Il n'existe pas ou ne vous est pas attribué."
            : 'Réessayez dans un instant.'}
        </p>
        <Link to="/issues" className="btn-secondary inline-flex">Retour aux problèmes</Link>
      </div>
    )
  }

  const urgency = URGENCIES[issue.urgency]
  const overdue = isOverdue(issue)
  const statusOptions = Object.entries(STATUSES).filter(
    ([value]) => user.role !== 'technicien' || value !== 'rejete'
  )

  const submitComment = (e) => {
    e.preventDefault()
    const content = comment.trim()
    if (!content) {
      notify("Écrivez un commentaire avant de l'envoyer.", 'error')
      return
    }
    commentMutation.mutate(content)
  }

  return (
    <div className="space-y-6">
      <Link to="/issues" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour aux problèmes
      </Link>

      <section className="card overflow-hidden">
        <div className={`h-1.5 ${urgency?.rail ?? 'bg-line'}`} aria-hidden="true" />
        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold sm:text-3xl">{issue.title}</h1>
            <div className="flex items-center gap-2">
              <UrgencyBadge value={issue.urgency} />
              <StatusBadge value={issue.status} animate />
            </div>
          </div>
          <p className="max-w-3xl whitespace-pre-wrap leading-relaxed text-ink/90">{issue.description}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card space-y-6 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">
            Commentaires <span className="text-ink-soft">({issue.comments.length})</span>
          </h2>
          <CommentList comments={issue.comments} highlightId={highlight} />

          <form onSubmit={submitComment} noValidate className="space-y-3 border-t border-line pt-6">
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
              className="field"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs tabular-nums text-ink-soft">{comment.length}/1000</span>
              <button type="submit" disabled={commentMutation.isPending} className="btn-primary">
                {commentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                Commenter
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-6">
          <section className="card space-y-3 p-6">
            <h2 className="text-lg font-semibold">État</h2>
            <div role="radiogroup" aria-label="État du problème" className="grid gap-2">
              {statusOptions.map(([value, s]) => {
                const active = issue.status === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={statusMutation.isPending}
                    onClick={() => !active && statusMutation.mutate(value)}
                    className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-200 disabled:cursor-wait ${
                      active
                        ? `border-transparent ${s.soft} ${s.text}`
                        : 'border-line bg-paper text-ink-soft hover:border-ink-soft hover:text-ink'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />
                      {s.label}
                    </span>
                    {active && <Check className="h-4 w-4 animate-pop" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">Détails</h2>
            <dl className="space-y-4">
              <Detail icon={Monitor} label="Appareil ou site">{issue.device}</Detail>
              <Detail icon={User} label="Responsable">{issue.assignee_name}</Detail>
              <Detail icon={Flag} label="Signalé par">{issue.author_name}</Detail>
              <Detail icon={CalendarClock} label="Échéance">
                <span className={overdue ? 'text-alert-ink' : ''}>{formatDate(issue.due_date)}</span>
                {overdue && <span className="block text-xs font-normal text-alert-ink">En retard</span>}
              </Detail>
            </dl>
          </section>

          <section className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">Historique</h2>
            <HistoryList history={issue.history} />
          </section>
        </div>
      </div>
    </div>
  )
}