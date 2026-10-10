import { createContext, useContext, useEffect, useState } from 'react'
import { fetchCsrf, getMe, login as apiLogin, logout as apiLogout } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        await fetchCsrf()          // pose le cookie CSRF
        setUser(await getMe())     // 403 si non connecté : on reste déconnecté
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])
  useEffect(() => {
    const recheck = async () => {
      try {
        setUser(await getMe())   // toujours connecté : le 403 était un vrai refus de droits
      } catch {
        setUser(null)            // session expirée : ProtectedRoute renvoie vers /login
      }
    }
    window.addEventListener('api-forbidden', recheck)
    return () => window.removeEventListener('api-forbidden', recheck)
  }, [])
  const login = async (email, password) => {
    const u = await apiLogin(email, password)
    setUser(u)
    return u
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}