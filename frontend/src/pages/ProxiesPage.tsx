import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { DashboardHeader } from '@/features/dashboard/components/Header/DashboardHeader'
import { NavigationTabs } from '@/shared/ui'
import { ProxyFilters } from '@/features/proxies/components/ProxyFilters'
import { ProxyList } from '@/features/proxies/components/ProxyList'
import { Footer } from '@/shared/ui'
import { useAuth } from '@/entities/auth/hooks/useAuth'
import { useProxies } from '@/features/proxies/hooks/useProxies'

type ProxyFilter = 'All' | 'Active' | 'Inactive'
type ProxySortOption = 'Name A-Z' | 'Name Z-A' | 'Date newest' | 'Date oldest'

export function ProxiesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { stats, loading: statsLoading } = useProxies()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProxyFilter>('All')
  const [sortOption, setSortOption] = useState<ProxySortOption>('Date newest')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <DashboardHeader />
      <NavigationTabs />

      {/* Ссылка на пул */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-4">
        <div className="relative">
          <a
            href="https://www.viabtc.com/observer/dashboard?access_key=818d9e02a383bcfb49c1c2443ed572a1"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-border rounded-xl px-4 py-2.5 text-text-primary hover:from-[#2a2a2a] hover:to-[#3a3a3a] hover:border-[#00FF26]/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00FF26]/10"
          >
            {/* Градиент обводка при ховере */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00FF26]/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>

            {/* Иконка */}
            <div className="w-7 h-7 bg-[#00FF26]/10 rounded-lg flex items-center justify-center group-hover:bg-[#00FF26]/20 transition-colors duration-300">
              <svg className="w-4 h-4 text-[#00FF26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* Контент */}
            <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors duration-300">
              Мониторинг Пула
            </span>

            {/* Стрелочка */}
            <svg className="w-4 h-4 text-text-muted group-hover:text-[#00FF26] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      <main className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-6 sm:py-8 md:py-12">
        {/* Статистика в компактном виде */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#222222] border border-border rounded-xl p-4">
            <h3 className="text-text-muted text-sm mb-1">Total Proxies</h3>
            {statsLoading ? (
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <div className="text-text-primary text-2xl font-bold">{stats?.total || 0}</div>
            )}
          </div>
          <div className="bg-[#222222] border border-border rounded-xl p-4">
            <h3 className="text-text-muted text-sm mb-1">Active</h3>
            {statsLoading ? (
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <div className="text-[#00FF26] text-2xl font-bold">{stats?.active || 0}</div>
            )}
          </div>
          <div className="bg-[#222222] border border-border rounded-xl p-4">
            <h3 className="text-text-muted text-sm mb-1">Inactive</h3>
            {statsLoading ? (
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
            ) : (
              <div className="text-red-500 text-2xl font-bold">{stats?.inactive || 0}</div>
            )}
          </div>
        </div>

        {/* Фильтры */}
        <ProxyFilters
          onSearch={setSearchQuery}
          onStatusFilter={setStatusFilter}
          onSort={setSortOption}
        />

        {/* Список прокси */}
        <ProxyList
          searchTerm={searchQuery}
          filterStatus={statusFilter}
          sortBy={sortOption}
        />
      </main>

      <Footer />
    </div>
  )
}