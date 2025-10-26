import {Navigate, Route, Routes} from 'react-router-dom'
import {AuthPage} from '@/pages/AuthPage'
import {DashboardPage} from '@/pages/DashboardPage'
import {AdminPage} from '@/pages/AdminPage'
import {AdminGuard} from '@/shared/guards/AdminGuard'
import {ProxiesPage} from '@/pages/ProxiesPage'
import {ConnectionSettingsPage} from '@/pages/ConnectionSettingsPage'

export function AppRouter() {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>
            <Route path="/proxies" element={<ProxiesPage/>}/>
            <Route path="/connection-settings" element={<ConnectionSettingsPage/>}/>

            {/* Админ роуты */}
            <Route path="/admin/*" element={
                <AdminGuard>
                    <AdminPage/>
                </AdminGuard>
            }/>

            <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
    )
}