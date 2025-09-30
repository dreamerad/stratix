import { useMemo } from 'react'

export type FilterStatus = 'all' | 'active' | 'inactive'
export type SortBy = 'name' | 'hashrate' | 'lastSeen'
export type SortOrder = 'asc' | 'desc'

interface WorkersFiltersProps {
  filterStatus: FilterStatus
  sortBy: SortBy
  sortOrder: SortOrder
  onFilterStatusChange: (status: FilterStatus) => void
  onSortByChange: (sortBy: SortBy) => void
  onSortOrderChange: (order: SortOrder) => void
  totalWorkers: number
  activeWorkers: number
}

export function WorkersFilters({
  filterStatus,
  sortBy,
  sortOrder,
  onFilterStatusChange,
  onSortByChange,
  onSortOrderChange,
  totalWorkers,
  activeWorkers
}: WorkersFiltersProps) {
  const statusOptions = useMemo(() => [
    { value: 'all' as FilterStatus, label: `Все (${totalWorkers})` },
    { value: 'active' as FilterStatus, label: `Активные (${activeWorkers})` },
    { value: 'inactive' as FilterStatus, label: `Неактивные (${totalWorkers - activeWorkers})` },
  ], [totalWorkers, activeWorkers])

  const sortOptions = [
    { value: 'name' as SortBy, label: 'По имени' },
    { value: 'hashrate' as SortBy, label: 'По хешрейту' },
    { value: 'lastSeen' as SortBy, label: 'По активности' },
  ]

  return (
    <div className="bg-[#222222] border border-border rounded-xl p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Фильтр по статусу */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <div className="flex rounded-lg bg-primary-bg-secondary p-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFilterStatusChange(option.value)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors flex-1 sm:flex-none ${
                    filterStatus === option.value
                      ? 'text-[#00FF26] bg-[radial-gradient(circle_at_center,rgba(0,255,38,0.2)_0%,rgba(0,255,38,0)_70%)]'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Сортировка */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortBy)}
              className="bg-primary-bg-secondary border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-green-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-primary-bg-secondary border border-border rounded-lg px-3 py-2 text-text-primary text-sm hover:border-green-500/50 transition-colors flex items-center gap-2"
            >
              {sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                className={`transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}