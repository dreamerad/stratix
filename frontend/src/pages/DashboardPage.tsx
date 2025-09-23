import { DashboardHeader } from '@/features/dashboard/components/Header/DashboardHeader'
import { HashrateChart } from '@/features/dashboard/components/Chart/HashrateChart'
import { WorkerStats } from '@/features/dashboard/components/Stats/WorkerStats'
import { FeeSettings } from '@/features/dashboard/components/FeeSettings/FeeSettings'
import { WorkerFilters } from '@/features/dashboard/components/Workers/WorkerFilters'
import {WorkersList} from "@/features/dashboard/components/Workers/WorkerCard.tsx";
export function DashboardPage() {
  return (
      <div className="min-h-screen bg-primary-bg">
          <DashboardHeader/>

          <main className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-6 sm:py-8 md:py-12">
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

              <div className="mt-6">
                  <FeeSettings/>
              </div>
              <div className="mt-6">
                  <WorkerFilters/>
              </div>
              <div className="mt-6">
                  <WorkersList/>
              </div>
          </main>
      </div>
  )
}

