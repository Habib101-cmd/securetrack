import { Link } from 'react-router-dom'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-xl shadow p-8 text-center space-y-3">
        <h1 className="text-2xl font-bold text-slate-800">Accès refusé</h1>
        <p className="text-slate-600">Vous n'avez pas les droits pour consulter cette page.</p>
        <Link to="/" className="text-blue-700 hover:underline">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  )
}