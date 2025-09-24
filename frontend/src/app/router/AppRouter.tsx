import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/entities/auth/hooks/useAuth'
import { AuthPage } from '@/pages/AuthPage.tsx'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'

export function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth()
  console.log('AppRouter: isAuthenticated =', isAuthenticated, 'isLoading =', isLoading)
  if (isLoading) {
    return <LoadingSpinner />
  }
  console.log('AppRouter: Rendering routes, isAuthenticated =', isAuthenticated)
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}