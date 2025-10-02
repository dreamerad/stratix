import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, BarChart3, Settings } from 'lucide-react'

interface Worker {
  worker: string
  hashrate: string
  raw_hashrate: number
  is_active: boolean
  last_seen: number
  coinType: 'BTC' | 'LTC'
}

interface WorkerGroup {
  name: string
  workers: Worker[]
  totalHashrate: number
  formattedHashrate: string
  activeCount: number
  totalCount: number
}

interface WorkersListProps {
  workers: Worker[]
  loading?: boolean
  searchTerm?: string
  filterStatus?: 'all' | 'active' | 'inactive'
  sortBy?: 'name' | 'hashrate' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export function WorkersList({
  workers,
  loading,
  searchTerm = '',
  filterStatus = 'all',
  sortBy = 'name',
  sortOrder = 'asc'
}: WorkersListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const formatHashrate = (hashrate: number): string => {
    const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s']
    let unitIndex = 0
    let value = hashrate

    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000
      unitIndex++
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`
  }

  const formatLastSeen = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const groupedWorkers = useMemo(() => {
    let filteredWorkers = workers

    if (searchTerm) {
      filteredWorkers = filteredWorkers.filter(worker =>
        worker.worker.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus === 'active') {
      filteredWorkers = filteredWorkers.filter(worker => worker.is_active)
    } else if (filterStatus === 'inactive') {
      filteredWorkers = filteredWorkers.filter(worker => !worker.is_active)
    }

    const groups: { [key: string]: Worker[] } = {}

    filteredWorkers.forEach(worker => {
      const baseName = worker.worker.split('.')[0]
      if (!groups[baseName]) {
        groups[baseName] = []
      }
      groups[baseName].push(worker)
    })

    let groupList = Object.entries(groups).map(([name, workerList]): WorkerGroup => {
      const totalHashrate = workerList.reduce((sum, w) => sum + w.raw_hashrate, 0)
      const activeCount = workerList.filter(w => w.is_active).length

      return {
        name,
        workers: workerList,
        totalHashrate,
        formattedHashrate: formatHashrate(totalHashrate),
        activeCount,
        totalCount: workerList.length
      }
    })

    groupList.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'hashrate':
          comparison = a.totalHashrate - b.totalHashrate
          break
        case 'status':
          const aActivePercent = a.activeCount / a.totalCount
          const bActivePercent = b.activeCount / b.totalCount
          comparison = aActivePercent - bActivePercent
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return groupList
  }, [workers, searchTerm, filterStatus, sortBy, sortOrder])

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedGroups(newExpanded)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (groupedWorkers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No workers found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {groupedWorkers.map((group) => (
        <div key={group.name} className="bg-card-bg border border-border rounded-lg overflow-hidden">
          {/* Заголовок группы */}
          <div
            className="flex items-center justify-between p-4 hover:bg-hover-bg cursor-pointer transition-colors"
            onClick={() => toggleGroup(group.name)}
          >
            <div className="flex items-center gap-3">
              <button className="text-text-muted hover:text-text-primary transition-colors">
                {expandedGroups.has(group.name) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <div>
                <h3 className="font-medium text-text-primary">{group.name}</h3>
                <p className="text-sm text-text-muted">
                  {group.totalCount === 1 ? '1 worker' : `${group.totalCount} workers`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Общий хешрейт */}
              <div className="text-right">
                <p className="font-semibold text-text-primary">{group.formattedHashrate}</p>
                <p className="text-sm text-text-muted">Total hashrate</p>
              </div>

              {/* Статус активности */}
              <div className="text-right">
                <p className={`font-semibold ${
                  group.activeCount === group.totalCount 
                    ? 'text-green-500' 
                    : group.activeCount === 0 
                    ? 'text-red-500' 
                    : 'text-yellow-500'
                }`}>
                  {group.activeCount}/{group.totalCount}
                </p>
                <p className="text-sm text-text-muted">Active</p>
              </div>

              {/* Кнопки управления */}
              <div className="flex items-center gap-2">
                {/* Кнопка настроек */}
                <button
                  className="p-2 text-text-muted hover:text-accent-primary hover:bg-hover-bg rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Show settings for group:', group.name)
                  }}
                >
                  <Settings className="h-4 w-4" />
                </button>

                {/* Кнопка графика */}
                <button
                  className="p-2 text-text-muted hover:text-accent-primary hover:bg-hover-bg rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Show chart for group:', group.name)
                  }}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Развернутый список воркеров в группе */}
          {expandedGroups.has(group.name) && (
            <div className="border-t border-border">
              {group.workers.map((worker) => (
                <div key={worker.worker} className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-hover-bg/50">
                  <div className="flex items-center gap-3 ml-7">
                    <div className={`w-2 h-2 rounded-full ${
                      worker.is_active ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-text-primary font-medium">{worker.worker}</span>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="font-medium text-text-primary">{worker.hashrate}</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-text-muted">{formatLastSeen(worker.last_seen)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}