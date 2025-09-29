import { useLocation, useNavigate } from 'react-router-dom'
import { AdminHeader } from '@/features/admin/components/Header/AdminHeader'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'

type AdminSection = 'users' | 'servers' | 'logs' | 'stats'

export function AdminPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const getActiveSection = (): AdminSection => {
    const path = location.pathname.split('/')[2]
    return (path as AdminSection) || 'users'
  }

  const activeSection = getActiveSection()

  const handleSectionChange = (section: AdminSection) => {
    navigate(`/admin/${section}`)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <AdminUsersPage />

      case 'logs':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Logs</h1>
            <div className="text-white">Logs content will be here</div>
          </div>
        )

      case 'servers':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Servers</h1>
            <div className="text-white">Servers content will be here</div>
          </div>
        )

      case 'stats':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Statistics</h1>
            <div className="text-white">Stats content will be here</div>
          </div>
        )

      default:
        return <AdminUsersPage />
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <AdminHeader
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <main>
        {renderContent()}
      </main>
    </div>
  )
}