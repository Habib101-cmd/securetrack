import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="card max-w-md animate-fade space-y-3 p-10 text-center">
        <Lock className="mx-auto h-8 w-8 text-alert" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">Accès refusé</h1>
        <p className="text-ink-soft">Votre rôle ne permet pas de consulter cette page.</p>
        <Link to="/" className="btn-primary inline-flex">Retour au tableau de bord</Link>
      </div>
    </div>
  )
}