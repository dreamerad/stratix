import { useState } from 'react'
import { DashboardHeader } from '@/features/dashboard/components/Header/DashboardHeader'
import { HashrateChart } from '@/features/dashboard/components/Chart/HashrateChart'
import { WorkerStats } from '@/features/dashboard/components/Stats/WorkerStats'
import { FeeSettings } from '@/features/dashboard/components/FeeSettings/FeeSettings'
import { WorkerFilters } from '@/features/dashboard/components/Workers/WorkerFilters'
import { WorkerCard, mockWorkers } from "@/features/dashboard/components/Workers/WorkerCard"
import { Pagination } from '@/shared/ui'
import { Footer } from '@/shared/ui'
export function DashboardPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const totalPages = Math.max(1, Math.ceil(mockWorkers.length / itemsPerPage))
    const startIndex = (currentPage - 1) * itemsPerPage
    const visibleWorkers = mockWorkers.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
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

                <div className="mb-6">
                    <FeeSettings/>
                </div>

                {/* Секция воркеров */}
                <div>
                    <h2 className="text-text-primary text-lg font-semibold mb-4">Worker Management</h2>
                    <WorkerFilters/>

                    {/* Сетка воркеров */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                        {visibleWorkers.map((worker) => (
                            <WorkerCard key={worker.id} worker={worker} />
                        ))}
                    </div>

                    {/* Пагинация */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>

            </main>
                          <Footer />

        </div>
    )
}