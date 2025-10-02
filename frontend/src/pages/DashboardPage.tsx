import {useState} from 'react'
import {Navigate} from 'react-router-dom'
import {DashboardHeader} from '@/features/dashboard/components/Header/DashboardHeader'
import {HashrateChart} from '@/features/dashboard/components/Chart/HashrateChart'
import {WorkerStats} from '@/features/dashboard/components/Stats/WorkerStats'
import {FeeSettings} from '@/features/dashboard/components/FeeSettings/FeeSettings'
import {WorkerFilters} from '@/features/dashboard/components/Workers/WorkerFilters'
import {WorkersList} from '@/features/workers/components/WorkersList'
import {useWorkers} from '@/features/workers/hooks/useWorkers'
import {Footer} from '@/shared/ui'
import {useAuth} from '@/entities/auth/hooks/useAuth'

export function DashboardPage() {
    const {isAuthenticated, isLoading} = useAuth()
    const {workers, loading: workersLoading} = useWorkers()

    // Состояние для фильтров
    const [searchQuery, setSearchQuery] = useState('')
    const [feeFilter, setFeeFilter] = useState<'All' | 'Custom'>('All')
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Unactive' | 'Offline'>('All')
    const [sortOption, setSortOption] = useState<'Bigger hashrate' | 'Smaller hashrate' | 'Name A-Z' | 'Name Z-A'>('Bigger hashrate')

    // Преобразуем фильтры в формат, понятный WorkersList
    const convertStatusFilter = (status: string): 'all' | 'active' | 'inactive' => {
        switch (status) {
            case 'Active': return 'active'
            case 'Unactive': return 'inactive'
            case 'Offline': return 'inactive'
            default: return 'all'
        }
    }

    const convertSortOption = (sort: string): { sortBy: 'name' | 'hashrate' | 'status', sortOrder: 'asc' | 'desc' } => {
        switch (sort) {
            case 'Bigger hashrate': return { sortBy: 'hashrate', sortOrder: 'desc' }
            case 'Smaller hashrate': return { sortBy: 'hashrate', sortOrder: 'asc' }
            case 'Name A-Z': return { sortBy: 'name', sortOrder: 'asc' }
            case 'Name Z-A': return { sortBy: 'name', sortOrder: 'desc' }
            default: return { sortBy: 'name', sortOrder: 'asc' }
        }
    }

    const { sortBy, sortOrder } = convertSortOption(sortOption)

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

                {/* Список воркеров */}
                <WorkersList
                    workers={workers}
                    loading={workersLoading}
                    searchTerm={searchQuery}
                    filterStatus={convertStatusFilter(statusFilter)}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            </main>

            <Footer/>
        </div>
    )
}