import {useState} from 'react'
import {Navigate} from 'react-router-dom'
import {DashboardHeader} from '@/features/dashboard/components/Header/DashboardHeader'
import {HashrateChart} from '@/features/dashboard/components/Chart/HashrateChart'
import {WorkerStats} from '@/features/dashboard/components/Stats/WorkerStats'
import {FeeSettings} from '@/features/dashboard/components/FeeSettings/FeeSettings'
import {WorkerFilters} from '@/features/dashboard/components/Workers/WorkerFilters'
import {Footer} from '@/shared/ui'
import {useAuth} from '@/entities/auth/hooks/useAuth'
import {WorkersGrid} from '@/features/workers/components/WorkersGrid'

export function DashboardPage() {
    const {isAuthenticated, isLoading} = useAuth()

    // Состояние для фильтров
    const [searchQuery, setSearchQuery] = useState('')
    const [feeFilter, setFeeFilter] = useState<'All' | 'Custom'>('All')
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Unactive' | 'Offline'>('All')
    const [sortOption, setSortOption] = useState<'Bigger hashrate' | 'Smaller hashrate' | 'Name A-Z' | 'Name Z-A'>('Bigger hashrate')

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

            <main className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-6 sm:py-8 md:py-12">
                {/* График и статистика */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    <div className="lg:col-span-3">
                        <HashrateChart/>
                    </div>
                    <div className="lg:col-span-1">
                        <WorkerStats/>
                    </div>
                </div>

                {/* Блоки с тоглами */}
                <div className="mb-6">
                    <FeeSettings/>
                </div>

                {/* Фильтры воркеров */}
                <WorkerFilters
                    onSearch={setSearchQuery}
                    onFeeFilter={setFeeFilter}
                    onStatusFilter={setStatusFilter}
                    onSort={setSortOption}
                />

                {/* Секция воркеров */}
                <WorkersGrid
                    searchQuery={searchQuery}
                    feeFilter={feeFilter}
                    statusFilter={statusFilter}
                    sortOption={sortOption}
                />
            </main>

            <Footer/>
        </div>
    )
}