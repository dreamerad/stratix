import { useState } from 'react'
import { clsx } from 'clsx'

type FeeFilter = 'All' | 'Custom'
type StatusFilter = 'All' | 'Active' | 'Unactive' | 'Offline'
type SortOption = 'Bigger hashrate' | 'Smaller hashrate' | 'Name A-Z' | 'Name Z-A'

interface WorkerFiltersProps {
  onSearch?: (query: string) => void
  onFeeFilter?: (filter: FeeFilter) => void
  onStatusFilter?: (filter: StatusFilter) => void
  onSort?: (sort: SortOption) => void
}

export function WorkerFilters({ onSearch, onFeeFilter, onStatusFilter, onSort }: WorkerFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFeeFilter, setActiveFeeFilter] = useState<FeeFilter>('All')
  const [activeStatusFilter, setActiveStatusFilter] = useState<StatusFilter>('All')
  const [activeSort, setActiveSort] = useState<SortOption>('Bigger hashrate')

  const feeFilters: FeeFilter[] = ['All', 'Custom']
  const statusFilters: StatusFilter[] = ['All', 'Active', 'Unactive', 'Offline']
  const sortOptions: SortOption[] = ['Bigger hashrate', 'Smaller hashrate', 'Name A-Z', 'Name Z-A']

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleFeeFilter = (filter: FeeFilter) => {
    setActiveFeeFilter(filter)
    onFeeFilter?.(filter)
  }

  const handleStatusFilter = (filter: StatusFilter) => {
    setActiveStatusFilter(filter)
    onStatusFilter?.(filter)
  }

  const handleSort = (sort: SortOption) => {
    setActiveSort(sort)
    onSort?.(sort)
  }

  return (
          <div>
        {/* Заголовок */}
        <h2 className="text-text-primary text-2xl font-semibold mb-4">Workers</h2>
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
              <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full p-2 pl-4 pr-10 bg-primary-card border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green transition-colors"
              />
              <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
          </div>

          {/* Fee Filter */}
          <div className="flex items-center gap-2">
              <span className="text-text-muted text-sm whitespace-nowrap">Fee:</span>
              <div className="flex items-center bg-primary-card rounded-lg p-1 border border-border">
                  {feeFilters.map((filter) => (
                      <button
                          key={filter}
                          onClick={() => handleFeeFilter(filter)}
                          className={clsx(
                              'px-3 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                              activeFeeFilter === filter
                                  ? 'text-[#00FF26] bg-[#00FF26]/10'
                                  : 'text-text-muted hover:text-text-primary'
                          )}
                      >
                          {filter}
                      </button>
                  ))}
              </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
              <span className="text-text-muted text-sm whitespace-nowrap">Status:</span>
              <div className="flex items-center bg-primary-card rounded-lg p-1 border border-border">
                  {statusFilters.map((filter) => (
                      <button
                          key={filter}
                          onClick={() => handleStatusFilter(filter)}
                          className={clsx(
                              'px-3 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                              activeStatusFilter === filter
                                  ? 'text-[#00FF26] bg-[#00FF26]/10'
                                  : 'text-text-muted hover:text-text-primary'
                          )}
                      >
                          {filter}
                      </button>
                  ))}
              </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
              <span className="text-text-muted text-sm whitespace-nowrap">Sort by:</span>
              <div className="relative">
                  <select
                      value={activeSort}
                      onChange={(e) => handleSort(e.target.value as SortOption)}
                      className="appearance-none bg-primary-card border border-border rounded-lg px-3 py-2 pr-8 text-text-primary text-sm focus:outline-none focus:border-accent-green cursor-pointer"
                  >
                      {sortOptions.map((option) => (
                          <option key={option} value={option}>
                              {option}
                          </option>
                      ))}
                  </select>
                  <svg
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
              </div>
          </div>

          {/* Export Button */}
          <button
              className="relative flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap overflow-hidden">
              {/* Зеленые акценты в углах */}
              <div className="absolute top-0 left-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>
              <div className="absolute bottom-0 right-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>

              {/* Контент кнопки */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M10 12.5V2.5M10 12.5L5.83333 8.33333M10 12.5L14.1667 8.33333M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
                      stroke="#00FF26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <span className="relative z-10">Export</span>
          </button>
      </div>
                      </div>
  )
}