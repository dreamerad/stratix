import { useAuth } from '@/entities/auth/hooks/useAuth'

export function DashboardPage() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Header */}
      <header className="bg-primary-bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl text-accent-green">⚡</span>
              <span className="text-xl font-bold text-text-primary">
                POOL<span className="text-accent-green">X</span>
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <span className="text-text-secondary">Welcome back!</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-accent-red text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
            <p className="text-text-secondary">Welcome to your mining management platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-primary-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Total Hashrate</p>
                  <p className="text-2xl font-bold text-text-primary">2.5 TH/s</p>
                </div>
                <div className="text-3xl text-accent-green">📊</div>
              </div>
            </div>

            <div className="bg-primary-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Active Workers</p>
                  <p className="text-2xl font-bold text-text-primary">12</p>
                </div>
                <div className="text-3xl text-accent-blue">⚙️</div>
              </div>
            </div>

            <div className="bg-primary-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Temperature</p>
                  <p className="text-2xl font-bold text-text-primary">65°C</p>
                </div>
                <div className="text-3xl text-accent-orange">🌡️</div>
              </div>
            </div>

            <div className="bg-primary-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Uptime</p>
                  <p className="text-2xl font-bold text-text-primary">99.2%</p>
                </div>
                <div className="text-3xl text-accent-green">✅</div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-primary-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Mining Overview</h2>
            <div className="text-center py-12 text-text-muted">
              <div className="text-4xl mb-4">🚧</div>
              <p>Dashboard content will be implemented here</p>
              <p className="text-sm mt-2">Real-time mining data, charts, and controls</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}