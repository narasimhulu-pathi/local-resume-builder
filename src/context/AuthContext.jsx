import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'rf_users'
const SESSION_KEY = 'rf_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      try {
        setUser(JSON.parse(session))
      } catch {}
    }
    setLoading(false)
  }, [])

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    } catch {
      return []
    }
  }

  const signup = (name, email, password) => {
    const users = getUsers()
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.')
    }
    const newUser = { id: crypto.randomUUID(), name, email, password, createdAt: new Date().toISOString() }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
    const sessionUser = { id: newUser.id, name, email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const login = (email, password) => {
    const users = getUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password.')
    const sessionUser = { id: found.id, name: found.name, email: found.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
