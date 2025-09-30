import { WorkersGrid } from '@/features/workers/components/WorkersGrid'
import { DashboardHeader } from '@/features/dashboard/components/Header/DashboardHeader'

export function WorkersPage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      <DashboardHeader />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-text-primary">Workers</h1>
          </div>
          <WorkersGrid />
        </div>
      </main>
    </div>
  )
}