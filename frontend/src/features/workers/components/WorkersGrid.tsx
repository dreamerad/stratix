import { useMemo } from 'react'
import { useWorkers } from '../hooks/useWorkers'
import { WorkerCard } from './WorkerCard'

interface WorkersGridProps {
  searchQuery: string
  feeFilter: 'All' | 'Custom'
  statusFilter: 'All' | 'Active' | 'Unactive' | 'Offline'
  sortOption: 'Bigger hashrate' | 'Smaller hashrate' | 'Name A-Z' | 'Name Z-A'
}

export function WorkersGrid({ searchQuery, feeFilter, statusFilter, sortOption }: WorkersGridProps) {
  const { workers, loading } = useWorkers()

  const filteredAndSortedWorkers = useMemo(() => {
    let filtered = workers

    // Поиск по имени
    if (searchQuery) {
      filtered = filtered.filter(worker =>
        worker.worker.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Фильтр по статусу
    if (statusFilter !== 'All') {
      if (statusFilter === 'Active') {
        filtered = filtered.filter(worker => worker.is_active)
      } else if (statusFilter === 'Unactive') {
        filtered = filtered.filter(worker => !worker.is_active)
      }
      // Offline пока оставляем пустым, так как нет такого поля в API
    }

    // Сортировка
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'Bigger hashrate':
          return b.raw_hashrate - a.raw_hashrate
        case 'Smaller hashrate':
          return a.raw_hashrate - b.raw_hashrate
        case 'Name A-Z':
          return a.worker.localeCompare(b.worker)
        case 'Name Z-A':
          return b.worker.localeCompare(a.worker)
        default:
          return 0
      }
    })

    return sorted
  }, [workers, searchQuery, feeFilter, statusFilter, sortOption])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (filteredAndSortedWorkers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No workers found matching your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredAndSortedWorkers.map((worker, index) => (
        <WorkerCard
          key={`${worker.worker}-${index}`}
          worker={worker}
          onClick={() => console.log('Open modal for:', worker.worker)}
        />
      ))}
    </div>
  )
}