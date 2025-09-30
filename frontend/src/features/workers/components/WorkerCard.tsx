import { Worker } from '../api/workers'

interface WorkerCardProps {
  worker: Worker
  onClick?: () => void
}

export function WorkerCard({ worker, onClick }: WorkerCardProps) {
  const formatLastSeen = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div
      onClick={onClick}
      className="bg-[#222222] border border-border rounded-xl p-4 cursor-pointer hover:border-green-500/50 transition-colors"
    >
      {/* Название воркера */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-text-primary font-medium text-sm truncate">{worker.worker}</h3>
        {/* Статус */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${
          worker.is_active ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>

      {/* Хешрейт */}
      <div className="mb-3">
        <p className="text-text-muted text-xs mb-1">Hashrate</p>
        <p className="text-text-primary font-semibold">{worker.hashrate}</p>
      </div>

      {/* Последняя активность */}
      <div>
        <p className="text-text-muted text-xs mb-1">Last seen</p>
        <p className="text-text-secondary text-sm">{formatLastSeen(worker.last_seen)}</p>
      </div>
    </div>
  )
}