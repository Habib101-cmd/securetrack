import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  if (user) return <Navigate to="/" replace />

  const onSubmit = async (values) => {
    setError('')
    try {
      await login(values.email, values.password)
      navigate('/')
    } catch (e) {
      setError(
        e.status === 429
          ? 'Trop de tentatives. Réessayez dans une minute.'
          : 'Identifiants incorrects'
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-8 rounded-xl shadow space-y-4"
        noValidate
      >
        <h1 className="text-2xl font-bold text-slate-800">SecureTrack</h1>
        <p className="text-sm text-slate-500">Connectez-vous pour continuer</p>

        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className="w-full border rounded px-3 py-2"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full border rounded px-3 py-2"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-800 text-white rounded py-2 hover:bg-slate-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}