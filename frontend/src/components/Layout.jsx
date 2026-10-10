import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ListChecks, LayoutDashboard, LogOut, Menu, PlusCircle, ShieldCheck, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS } from '../utils/constants'
import Avatar from './Avatar'

function NavItem({ to, icon: Icon, end, forceActive, onClick, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          (forceActive ?? isActive)
            ? 'bg-white/10 text-white'
            : 'text-white/65 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => {
        const on = forceActive ?? isActive
        return (
          <>
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-tide transition-all duration-200 ${
                on ? 'scale-y-100 opacity-100' : 'scale-y-50 opacity-0'
              }`}
            />
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {children}
          </>
        )
      }}
    </NavLink>
  )
}

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const canCreate = user.role === 'analyste' || user.role === 'admin'
  const onList = pathname === '/issues' || (pathname.startsWith('/issues/') && pathname !== '/issues/new')

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-tide text-white">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-display text-lg font-semibold text-white">SecureTrack</span>
      </div>

      <nav aria-label="Navigation principale" className="flex-1 space-y-1 px-3">
        <NavItem to="/" end icon={LayoutDashboard} onClick={onNavigate}>
          Tableau de bord
        </NavItem>
        <NavItem to="/issues" forceActive={onList} icon={ListChecks} onClick={onNavigate}>
          Problèmes
        </NavItem>
        {canCreate && (
          <NavItem to="/issues/new" icon={PlusCircle} onClick={onNavigate}>
            Ajouter un problème
          </NavItem>
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.first_name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user.first_name}</p>
            <p className="truncate text-xs text-white/60">{ROLE_LABELS[user.role] ?? user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/65 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2"
      >
        Aller au contenu
      </a>

      <header className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3 md:hidden">
        <span className="flex items-center gap-2 font-display font-semibold text-white">
          <ShieldCheck className="h-5 w-5 text-tide" aria-hidden="true" />
          SecureTrack
        </span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="rounded-lg p-2 text-white hover:bg-white/10"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 animate-fade bg-ink-deep/60 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-ink transition-transform duration-300 ease-out md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer le menu"
          className="absolute right-3 top-5 rounded-lg p-2 text-white/70 hover:bg-white/10 md:hidden"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </aside>

      <main id="contenu" className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
          <div key={pathname} className="animate-fade">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}