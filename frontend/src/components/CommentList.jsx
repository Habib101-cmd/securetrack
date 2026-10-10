import { MessageSquare } from 'lucide-react'
import { formatDateTime } from '../utils/dates'
import Avatar from './Avatar'

export default function CommentList({ comments, highlightId }) {
  if (comments.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-mist px-4 py-5 text-sm text-ink-soft">
        <MessageSquare className="h-5 w-5 shrink-0" aria-hidden="true" />
        Aucun commentaire. Notez ici l'avancement de la correction.
      </div>
    )
  }

  return (
    <ul className="space-y-5">
      {comments.map((c) => (
        <li key={c.id} className={`flex gap-3 ${c.id === highlightId ? 'animate-rise' : ''}`}>
          <Avatar name={c.author} />
          <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-mist px-4 py-3">
            <p className="text-sm">
              <span className="font-semibold">{c.author}</span>
              <time dateTime={c.created_at} className="ml-2 text-xs text-ink-soft">
                {formatDateTime(c.created_at)}
              </time>
            </p>
            {/* Texte brut : React échappe le contenu, un <script> s'affiche tel quel */}
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">{c.content}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}