import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, type AuthUser } from '@/auth'

export function RequireAuth() {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export function RequireRole({ roles }: { roles: AuthUser['role'][] }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
