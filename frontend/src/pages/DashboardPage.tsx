import { DashboardHeader } from '@/features/dashboard/components/Header/DashboardHeader'
export function DashboardPage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      <DashboardHeader />
      {/* Остальной контент dashboard'а */}
      <main className="p-6">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard Content</h1>
      </main>
    </div>
  )
}