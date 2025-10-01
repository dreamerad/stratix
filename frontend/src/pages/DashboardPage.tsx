import {Navigate} from 'react-router-dom'
import {DashboardHeader} from '@/features/dashboard/components/Header/DashboardHeader'
import {HashrateChart} from '@/features/dashboard/components/Chart/HashrateChart'
import {WorkerStats} from '@/features/dashboard/components/Stats/WorkerStats'
import {FeeSettings} from '@/features/dashboard/components/FeeSettings/FeeSettings'
import {Footer} from '@/shared/ui'
import {useAuth} from '@/entities/auth/hooks/useAuth'
import {WorkersGrid} from '@/features/workers/components/WorkersGrid'

export function DashboardPage() {
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

                {/* Секция воркеров */}
                <div>
                    <h2 className="text-text-primary text-lg font-semibold mb-4">Workers</h2>
                    <WorkersGrid/>
                </div>
            </main>

            <Footer/>
        </div>
    )
}