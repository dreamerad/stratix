import { Navigate } from 'react-router-dom'
import { useAuth } from '@/entities/auth/hooks/useAuth'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { userData, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-primary-bg text-white">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (!userData?.isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}