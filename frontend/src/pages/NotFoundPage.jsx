import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="card max-w-md animate-fade space-y-3 p-10 text-center">
        <Compass className="mx-auto h-8 w-8 text-tide" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">Page introuvable</h1>
        <p className="text-ink-soft">Cette adresse n'existe pas ou a été déplacée.</p>
        <Link to="/" className="btn-primary inline-flex">Retour à l'accueil</Link>
      </div>
    </div>
  )
}