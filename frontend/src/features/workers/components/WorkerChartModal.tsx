import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { workerHistoryApi, WorkerHistoryDataPoint } from '../api/workerHistory'
import { useCurrency } from '@/shared/providers/CurrencyProvider'

interface WorkerChartModalProps {
  isOpen: boolean
  onClose: () => void
  workerName: string
  isGroup?: boolean
}

type TimeRange = 1 | 6 | 24 | 48 | 168

export function WorkerChartModal({ isOpen, onClose, workerName, isGroup = false }: WorkerChartModalProps) {
  const [data, setData] = useState<WorkerHistoryDataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(24)
  const { currency } = useCurrency()

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: 1, label: 'Последний час' },
    { value: 6, label: '6 часов' },
    { value: 24, label: '24 часа' },
    { value: 48, label: '48 часов' },
    { value: 168, label: 'Неделя' }
  ]

  const fetchData = async () => {
    if (!isOpen) return

    setLoading(true)
    try {
      const response = isGroup
        ? await workerHistoryApi.getGroupHistory(workerName, selectedTimeRange, currency)
        : await workerHistoryApi.getWorkerHistory(workerName, selectedTimeRange, currency)

      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch worker history:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [isOpen, selectedTimeRange, currency, workerName, isGroup])

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    if (selectedTimeRange <= 6) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (selectedTimeRange <= 48) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const formatHashrate = (value: number): string => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)} TH/s`
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)} GH/s`
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)} MH/s`
    } else {
      return `${(value / 1e3).toFixed(2)} KH/s`
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-1">{formatTimestamp(label)}</p>
          <p className="text-[#00FF26] font-semibold">
            {formatHashrate(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-xl w-full max-w-4xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isGroup ? `Группа: ${workerName}` : `Воркер: ${workerName}`}
            </h2>
            <p className="text-gray-400 text-sm">История хешрейта ({currency})</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex gap-2 flex-wrap">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedTimeRange(range.value)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedTimeRange === range.value
                    ? 'bg-[#00FF26] text-black font-medium'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="p-6" style={{ height: '400px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF26]"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Нет данных для отображения</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={formatHashrate}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="raw_hashrate"
                  stroke="#00FF26"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: '#00FF26',
                    stroke: '#00FF26',
                    strokeWidth: 0
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}