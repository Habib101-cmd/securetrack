export default function CommentList({ comments }) {
    if (comments.length === 0) {
      return <p className="text-sm text-slate-500">Aucun commentaire pour le moment.</p>
    }
  
    return (
      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="border rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">
              {c.author} - {new Date(c.created_at).toLocaleString('fr-FR')}
            </p>
            {/* Texte brut : React échappe le contenu, un <script> s'affiche tel quel */}
            <p className="text-sm whitespace-pre-wrap">{c.content}</p>
          </li>
        ))}
      </ul>
    )
  }