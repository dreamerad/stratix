import {Navigate} from 'react-router-dom'
import {DashboardHeader} from '@/features/dashboard/components/Header/DashboardHeader'
import {Footer, NavigationTabs} from '@/shared/ui'
import {ProxyList} from '@/features/proxies/components/ProxyList'
import {useAuth} from '@/entities/auth/hooks/useAuth'

export function ProxiesPage() {
    const {isAuthenticated, isLoading} = useAuth()


    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary-bg flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace/>
    }

    return (
        <div className="min-h-screen bg-primary-bg">
            <DashboardHeader/>
            <NavigationTabs/>

            {/* Ссылка на пул */}


            <main className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-6 sm:py-8 md:py-12">
                {/* Статистика в компактном виде */}
                {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">*/}
                {/*  <div className="bg-[#222222] border border-border rounded-xl p-4">*/}
                {/*    <h3 className="text-text-muted text-sm mb-1">Total Proxies</h3>*/}
                {/*    {statsLoading ? (*/}
                {/*      <div className="h-8 bg-gray-700 rounded animate-pulse"></div>*/}
                {/*    ) : (*/}
                {/*      <div className="text-text-primary text-2xl font-bold">{stats?.total || 0}</div>*/}
                {/*    )}*/}
                {/*  </div>*/}
                {/*  <div className="bg-[#222222] border border-border rounded-xl p-4">*/}
                {/*    <h3 className="text-text-muted text-sm mb-1">Active</h3>*/}
                {/*    {statsLoading ? (*/}
                {/*      <div className="h-8 bg-gray-700 rounded animate-pulse"></div>*/}
                {/*    ) : (*/}
                {/*      <div className="text-[#00FF26] text-2xl font-bold">{stats?.active || 0}</div>*/}
                {/*    )}*/}
                {/*  </div>*/}
                {/*  <div className="bg-[#222222] border border-border rounded-xl p-4">*/}
                {/*    <h3 className="text-text-muted text-sm mb-1">Inactive</h3>*/}
                {/*    {statsLoading ? (*/}
                {/*      <div className="h-8 bg-gray-700 rounded animate-pulse"></div>*/}
                {/*    ) : (*/}
                {/*      <div className="text-red-500 text-2xl font-bold">{stats?.inactive || 0}</div>*/}
                {/*    )}*/}
                {/*  </div>*/}
                {/*</div>*/}

                {/*/!* Фильтры *!/*/}
                {/*<ProxyFilters*/}
                {/*  onSearch={setSearchQuery}*/}
                {/*  onStatusFilter={setStatusFilter}*/}
                {/*  onSort={setSortOption}*/}
                {/*/>*/}

                {/* Список прокси */}
                <ProxyList/>
            </main>

            <Footer/>
        </div>
    )
}