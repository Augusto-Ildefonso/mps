import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

/**
 * Provides JWT auth state to the app.
 * Persists the token in localStorage under "authToken".
 * The pedidos axios client reads the same key via its request interceptor.
 */
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(
    () => localStorage.getItem('authToken')
  )

  /** Store token in state and localStorage. */
  const setToken = (t) => {
    localStorage.setItem('authToken', t)
    setTokenState(t)
  }

  /** Remove token from state and localStorage. */
  const clearToken = () => {
    localStorage.removeItem('authToken')
    setTokenState(null)
  }

  const isAuthenticated = token !== null

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to consume AuthContext. Must be called inside <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
