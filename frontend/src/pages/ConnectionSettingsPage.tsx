import {Navigate} from 'react-router-dom'
import {DashboardHeader} from '@/features/dashboard/components/Header/DashboardHeader'
import {Footer, NavigationTabs} from '@/shared/ui'
import {ConnectionInfo} from '@/features/connection-settings/components/ConnectionInfo/ConnectionInfo'
import {useAuth} from '@/entities/auth/hooks/useAuth'

export function ConnectionSettingsPage() {
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

            <main className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-6 sm:py-8 md:py-12">
                <ConnectionInfo/>
            </main>

            <Footer/>
        </div>
    )
}