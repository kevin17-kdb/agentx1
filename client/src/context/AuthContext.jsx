import { useEffect, useState } from 'react'
import { api, getSessionUser, getToken, setSession, clearSession } from '../api/client'
import { AuthContext } from './authContextValue'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSessionUser())
  const [token, setToken] = useState(getToken())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!token) return setReady(true)
    api
      .me()
      .then((res) => setUser(res.user))
      .catch(() => {
        clearSession()
        setToken(null)
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [token])

  const login = async (uid, password) => {
    const res = await api.login(uid, password)
    setSession(res.token, res.user)
    setToken(res.token)
    setUser(res.user)
    return res.user
  }

  const logout = () => {
    api.logout().catch(() => {})
    clearSession()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}