import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white rounded-xl shadow p-8 text-center space-y-3">
        <h1 className="text-2xl font-bold text-slate-800">Page introuvable</h1>
        <p className="text-slate-600">Cette adresse n'existe pas.</p>
        <Link to="/" className="text-blue-700 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}