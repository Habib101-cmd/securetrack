import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  `px-3 py-1 rounded ${isActive ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-100'}`

export default function Layout() {
  const { user, logout } = useAuth()
  const canCreate = user.role === 'analyste' || user.role === 'admin'

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          <span className="font-bold text-slate-800 mr-4">SecureTrack</span>
          <NavLink to="/" end className={linkClass}>
            Tableau de bord
          </NavLink>
          <NavLink to="/issues" end className={linkClass}>
            Problèmes
          </NavLink>
          {canCreate && (
            <NavLink to="/issues/new" className={linkClass}>
              Ajouter
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <span>
            {user.first_name} ({user.role})
          </span>
          <button onClick={logout} className="text-red-700 hover:underline">
            Se déconnecter
          </button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}