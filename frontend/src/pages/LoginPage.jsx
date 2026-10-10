import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

const SCENE = [
  { title: 'Logiciel ancien', device: 'Ordinateur 01' },
  { title: 'Pare-feu désactivé', device: 'Ordinateur 02' },
  { title: 'Certificat expiré', device: 'Site de démonstration' },
]

function Scene() {
  return (
    <ul aria-hidden="true" className="space-y-3">
      {SCENE.map((row, i) => (
        <li
          key={row.title}
          className="relative flex animate-rise items-center justify-between overflow-hidden rounded-xl bg-white/[0.06] py-3.5 pl-5 pr-4 text-sm text-white"
          style={{ animationDelay: `${0.2 + i * 0.25}s` }}
        >
          <span className="scene-rail absolute inset-y-0 left-0 w-1" style={{ '--d': `${0.8 + i * 0.9}s` }} />
          <span>
            <span className="block font-medium">{row.title}</span>
            <span className="block text-white/60">{row.device}</span>
          </span>
          <span className="relative h-5 w-20 text-xs font-semibold">
            <span className="scene-todo absolute right-0 top-0 text-white/70" style={{ '--d': `${0.8 + i * 0.9}s` }}>
              À traiter
            </span>
            <span className="scene-done absolute right-0 top-0 text-sage-soft" style={{ '--d': `${0.8 + i * 0.9}s` }}>
              Corrigé
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  if (user) return <Navigate to="/" replace />

  const onSubmit = async (values) => {
    setError(null)
    try {
      await login(values.email, values.password)
      navigate('/')
    } catch (e) {
      const text =
        e.status === 429
          ? 'Trop de tentatives. Réessayez dans une minute.'
          : e.status === 401
            ? 'Adresse e-mail ou mot de passe incorrect.'
            : 'Connexion impossible. Réessayez dans un instant.'
      setError({ text, id: Date.now() })
    }
  }

  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 flex-col justify-between bg-ink p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-tide">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold">SecureTrack</span>
        </div>

        <div className="max-w-md space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-semibold leading-tight">
              Suivez chaque problème de sécurité jusqu'à sa correction.
            </h2>
            <p className="text-white/65">
              Signalez, attribuez et gardez l'historique de chaque correction, pour toute l'équipe.
            </p>
          </div>
          <Scene />
        </div>

        <p className="text-sm text-white/45">Projet de démonstration, données fictives.</p>
      </section>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm animate-fade space-y-5">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-tide text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold">SecureTrack</span>
          </div>

          <div>
            <h1 className="text-3xl font-semibold">Se connecter</h1>
            <p className="mt-1 text-ink-soft">Accédez au suivi des problèmes de sécurité de votre équipe.</p>
          </div>

          {error && (
            <p
              key={error.id}
              role="alert"
              className="animate-shake rounded-lg bg-alert-soft px-3.5 py-2.5 text-sm text-alert-ink"
            >
              {error.text}
            </p>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Adresse e-mail
            </label>
            <input id="email" type="email" autoComplete="username" className="field" {...register('email')} />
            {errors.email && <p className="mt-1.5 text-xs text-alert-ink">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                className="field pr-11"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-soft hover:text-ink"
              >
                {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-alert-ink">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </main>
    </div>
  )
}