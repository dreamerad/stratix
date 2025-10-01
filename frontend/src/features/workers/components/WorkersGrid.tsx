import { useMemo, useState } from 'react'
import { WorkerCard } from './WorkerCard'
import { WorkersFilters, FilterStatus, SortBy, SortOrder } from './WorkersFilters'
import { useWorkers } from '../hooks/useWorkers'

export function WorkersGrid() {
  const { workers, loading, totalWorkers, activeWorkers } = useWorkers()

  // Фильтры и сортировка
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const filteredAndSortedWorkers = useMemo(() => {
    let filtered = workers

    // Фильтрация по статусу
    if (filterStatus === 'active') {
      filtered = filtered.filter(worker => worker.is_active)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(worker => !worker.is_active)
    }

    // Сортировка
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.worker.localeCompare(b.worker)
          break
        case 'hashrate':
          comparison = a.raw_hashrate - b.raw_hashrate
          break
        case 'lastSeen':
          comparison = a.last_seen - b.last_seen
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [workers, filterStatus, sortBy, sortOrder])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div>
      <WorkersFilters
        filterStatus={filterStatus}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onFilterStatusChange={setFilterStatus}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        totalWorkers={totalWorkers}
        activeWorkers={activeWorkers}
      />

      {filteredAndSortedWorkers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted">No workers found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedWorkers.map((worker, index) => (
            <WorkerCard
              key={`${worker.worker}-${index}`}
              worker={worker}
              onClick={() => console.log('Open modal for:', worker.worker)}
            />
          ))}
        </div>
      )}
    </div>
  )
}