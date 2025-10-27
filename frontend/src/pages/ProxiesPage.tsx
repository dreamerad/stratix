import {useState} from 'react'
import {Navigate} from 'react-router-dom'
import {DashboardHeader} from '@/features/dashboard/components/Header/DashboardHeader'
import {Footer, NavigationTabs} from '@/shared/ui'
import {ProxyList} from '@/features/proxies/components/ProxyList'
import {ContactModal} from '@/features/proxies/components/ContactModal'
import {useAuth} from '@/entities/auth/hooks/useAuth'

export function ProxiesPage() {
    const {isAuthenticated, isLoading} = useAuth()
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)

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
                {/* Pool Info Banner */}
                <div className="mb-8 bg-gradient-to-r from-[#00FF26]/10 to-[#00e676]/5 border border-[#00FF26]/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Pool Icon */}
                        <div className="w-10 h-10 bg-[#00FF26]/20 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00FF26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="#00FF26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="#00FF26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-text-primary font-medium text-sm">Need a pool?</h3>
                            <p className="text-text-muted text-xs">Get connected to the best mining pools for optimal performance</p>
                        </div>
                    </div>

                    {/* Contact Button */}
                    <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#00FF26]/10 hover:bg-[#00FF26]/20 border border-[#00FF26]/30 rounded-lg text-[#00FF26] text-sm font-medium transition-all duration-200 hover:scale-105"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Contact us
                    </button>
                </div>

                {/* Список прокси */}
                <ProxyList/>
            </main>

            <Footer/>

            {/* Contact Modal */}
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </div>
    )
}