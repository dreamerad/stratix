import { DashboardHeader } from '@/features/dashboard/components/Header/DashboardHeader'
import { HashrateChart } from '@/features/dashboard/components/Chart/HashrateChart'
import { WorkerStats } from '@/features/dashboard/components/Stats/WorkerStats'
export function DashboardPage() {
  return (
      <div className="min-h-screen bg-primary-bg">
          <DashboardHeader/>

          <main className="px-32 py-12">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  {/* График - занимает 3 колонки */}
                  <div className="xl:col-span-3">
                      <HashrateChart/>
                  </div>

                  {/* Статистика - занимает 1 колонку */}
                  <div className="xl:col-span-1">
                      <WorkerStats/>
                  </div>
              </div>
          </main>
      </div>
  )
}