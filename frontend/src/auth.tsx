import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi, setAuthToken, UNAUTHORIZED_EVENT, type Role } from '@/api'

export interface AuthUser {
  userId: number
  fullName: string
  email: string
  role: Role
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  register: (input: {
    fullName: string
    email: string
    password: string
    department?: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USER_STORAGE_KEY = 'smarthelp.user'

function loadStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser)

  function applyAuthResponse(response: Awaited<ReturnType<typeof authApi.login>>) {
    const authUser: AuthUser = {
      userId: response.userId,
      fullName: response.fullName,
      email: response.email,
      role: response.role,
    }
    setAuthToken(response.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
  }

  async function login(email: string, password: string) {
    applyAuthResponse(await authApi.login(email, password))
  }

  async function register(input: {
    fullName: string
    email: string
    password: string
    department?: string
  }) {
    applyAuthResponse(await authApi.register(input))
  }

  function logout() {
    setAuthToken(null)
    localStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
  }

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
