import { useState } from 'react'
import { clsx } from 'clsx'

type ProxyFilters = 'All' | 'Active' | 'Inactive'
type ProxySortOption = 'Name A-Z' | 'Name Z-A' | 'Date newest' | 'Date oldest'

interface ProxyFiltersProps {
  onSearch?: (query: string) => void
  onStatusFilter?: (filter: ProxyFilters) => void
  onSort?: (sort: ProxySortOption) => void
}

export function ProxyFilters({ onSearch, onStatusFilter, onSort }: ProxyFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatusFilter, setActiveStatusFilter] = useState<ProxyFilters>('All')
  const [activeSort, setActiveSort] = useState<ProxySortOption>('Date newest')

  const statusFilters: ProxyFilters[] = ['All', 'Active', 'Inactive']
  const sortOptions: ProxySortOption[] = ['Name A-Z', 'Name Z-A', 'Date newest', 'Date oldest']

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleStatusFilter = (filter: ProxyFilters) => {
    setActiveStatusFilter(filter)
    onStatusFilter?.(filter)
  }

  const handleSort = (sort: ProxySortOption) => {
    setActiveSort(sort)
    onSort?.(sort)
  }

  return (
    <div>
      {/* Заголовок */}
      <h2 className="text-text-primary text-2xl font-semibold mb-4">Proxies</h2>

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Поиск по ID..."
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

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-sm whitespace-nowrap">Статус:</span>
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
          <span className="text-text-muted text-sm whitespace-nowrap">Сортировка:</span>
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => handleSort(e.target.value as ProxySortOption)}
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

        {/* Add Proxy Button */}
        {/*<button*/}
        {/*  className="relative flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap overflow-hidden">*/}
        {/*  /!* Зеленые акценты в углах *!/*/}
        {/*  <div className="absolute top-0 left-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>*/}
        {/*  <div className="absolute bottom-0 right-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>*/}

        {/*  /!* Содержимое кнопки *!/*/}
        {/*  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
        {/*    <path*/}
        {/*      d="M10 4.16667V15.8333M4.16667 10H15.8333"*/}
        {/*      stroke="#00FF26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>*/}
        {/*  </svg>*/}

        {/*  <span className="relative z-10">Add Proxy</span>*/}
        {/*</button>*/}
      </div>
    </div>
  )
}