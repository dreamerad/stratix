import {useState} from 'react'
import {useWorkers} from '@/features/workers/hooks/useWorkers'
import {DNSModal} from '../DNSModal/DNSModal'

export function WorkerStats() {
    const [isDNSModalOpen, setIsDNSModalOpen] = useState(false)
    const {totalWorkers, activeWorkers, inactiveWorkers, loading} = useWorkers()

    if (loading) {
        return (
            <div className="bg-[#222222] border border-border rounded-xl p-6 h-full flex flex-col">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded mb-1"></div>
                    <div className="h-8 bg-gray-700 rounded mb-6"></div>
                    <div className="border-t border-border my-6"></div>
                    <div className="space-y-3 mb-6">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#222222] border border-border rounded-xl p-6 h-full flex flex-col">
            {/* Total workers */}
            <div className="mb-6">
                <h3 className="text-text-white text-sm mb-1 font-semibold">Total workers</h3>
                <div className="text-text-primary text-3xl">{totalWorkers}</div>
            </div>
            {/* Divider */}
            <div className="border-t border-border my-6"></div>
            {/* Workers status */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">{activeWorkers} active</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">{inactiveWorkers} inactive</span>
                </div>
                {/*<div className="flex items-center justify-between">*/}
                {/*    <span className="text-text-muted text-sm">0 offline</span>*/}
                {/*</div>*/}
            </div>
            {/* DNS Info */}
            <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-text-muted text-sm">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2L2 7L10 12L18 7L10 2Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 12L10 17L18 12" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>DNS: 8.8.8.8</span>
                </div>

                <button
                    onClick={() => setIsDNSModalOpen(true)}
                    className="text-xs bg-[#00FF26]/10 text-[#00FF26] px-2 py-1 rounded-md hover:bg-[#00FF26]/20 transition-colors"
                >
                    More
                </button>
            </div>

            {/* DNS Modal */}
            <DNSModal
                isOpen={isDNSModalOpen}
                onClose={() => setIsDNSModalOpen(false)}
            />
            {/* Custom fee info */}
            {/*<div className="flex items-center gap-2 text-text-muted text-sm mt-auto">*/}
            {/*    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*        <path*/}
            {/*            d="M15.8335 4.16683L4.16683 15.8335M7.50016 5.41683C7.50016 6.56742 6.56742 7.50016 5.41683 7.50016C4.26624 7.50016 3.3335 6.56742 3.3335 5.41683C3.3335 4.26624 4.26624 3.3335 5.41683 3.3335C6.56742 3.3335 7.50016 4.26624 7.50016 5.41683ZM16.6668 14.5835C16.6668 15.7341 15.7341 16.6668 14.5835 16.6668C13.4329 16.6668 12.5002 15.7341 12.5002 14.5835C12.5002 13.4329 13.4329 12.5002 14.5835 12.5002C15.7341 12.5002 16.6668 13.4329 16.6668 14.5835Z"*/}
            {/*            stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>*/}
            {/*    </svg>*/}

            {/*    <span className="text-white">0 workers with custom fee</span>*/}
            {/*</div>*/}
        </div>
    )
}