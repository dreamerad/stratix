import {useLocation, useNavigate} from 'react-router-dom'
import {clsx} from 'clsx'

interface Tab {
    id: string
    label: string
    path: string
    icon: React.ReactNode
}

const tabs: Tab[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="9" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="5" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="12" width="7" height="9" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="16" width="7" height="5" stroke="currentColor" strokeWidth="2"/>
            </svg>
        )
    },
    {
        id: 'proxies',
        label: 'Proxies-configs',
        path: '/proxies',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        )
    },
    {
        id: 'pool-monitoring',
        label: 'Pool',
        path: 'https://www.viabtc.com/observer/dashboard?access_key=818d9e02a383bcfb49c1c2443ed572a1',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3 13L6.586 9.414C7.367 8.633 8.633 8.633 9.414 9.414L12 12L18.586 5.414C19.367 4.633 20.633 4.633 21.414 5.414L21 6"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 10V6H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <rect x="3" y="16" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        )
    }
]

export function NavigationTabs() {
    const location = useLocation()
    const navigate = useNavigate()

    const activeTab = tabs.find(tab => tab.path === location.pathname)

    return (
        <div className="bg-[#191919] border-b border-border">
            <div className="px-4 sm:px-3 md:px-8 lg:px-16 xl:px-32">
                <div className="flex items-center">
                    {tabs.map((tab, index) => {
                        const isActive = activeTab?.id === tab.id
                        const isExternalLink = tab.path.startsWith('http')
                        const marginClass = index === 0 ? '' : index === 2 ? 'ml-4' : 'ml-8'

                        if (isExternalLink) {
                            return (
                                <a
                                    key={tab.id}
                                    href={tab.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={clsx(
                                        'relative flex items-center gap-3 px-1 py-4 text-sm font-medium transition-all duration-200',
                                        'border-b-2 whitespace-nowrap',
                                        'text-text-muted border-transparent hover:text-text-primary',
                                        marginClass
                                    )}
                                >
                            <span
                                className="transition-colors duration-200 text-text-muted">                    {tab.icon}
                  </span>
                                    <span>{tab.label}</span>
                                </a>
                            )
                        }

                        return (
                            <button
                                key={tab.id}
                                onClick={() => navigate(tab.path)}
                                className={clsx(
                                    'relative flex items-center gap-3 px-1 py-4 text-sm font-medium transition-all duration-200',
                                    'border-b-2 whitespace-nowrap',
                                    isActive
                                        ? 'text-[#00FF26] border-[#00FF26]'
                                        : 'text-text-muted border-transparent hover:text-text-primary hover:border-text-muted',
                                    marginClass
                                )}
                            >
                <span className={clsx(
                    'transition-colors duration-200',
                    isActive ? 'text-[#00FF26]' : 'text-text-muted group-hover:text-text-primary'
                )}>
                  {tab.icon}
                </span>
                                <span>{tab.label}</span>

                                {/* Анимированный индикатор */}
                                {isActive && (
                                    <div
                                        className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00FF26] to-[#00e676] animate-fadeIn"/>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}