import { useMemo } from 'react'
import { X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useAllWorkersHistory } from '../hooks/useAllWorkersHistory'

interface WorkerChartModalProps {
  isOpen: boolean
  onClose: () => void
  workerName: string
  isGroup?: boolean
}

type TimeRange = 1 | 6 | 24 | 48 | 168

export function WorkerChartModal({ isOpen, onClose, workerName, isGroup = false }: WorkerChartModalProps) {
  const formatHashrate = (value: number): string => {
    const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s']
    let unitIndex = 0
    let displayValue = value

    while (displayValue >= 1000 && unitIndex < units.length - 1) {
      displayValue /= 1000
      unitIndex++
    }

    return `${displayValue.toFixed(2)} ${units[unitIndex]}`
  }

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

  const {
    loading,
    selectedTimeRange,
    setSelectedTimeRange,
    getGroupData,
    getWorkerData,
    currency,
    allData
  } = useAllWorkersHistory()

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: 1, label: 'Последний час' },
    { value: 6, label: '6 часов' },
    { value: 24, label: '24 часа' },
    { value: 48, label: '48 часов' },
    { value: 168, label: 'Неделя' }
  ]

  const chartData = useMemo(() => {
    if (isGroup) {
      const groupWorkers = Object.keys(allData?.workers || {})
        .filter(name => name.startsWith(workerName + '.'))

      if (groupWorkers.length === 0) return []

      const allTimestamps = new Set<number>()
      groupWorkers.forEach(workerName => {
        const workerData = getWorkerData(workerName)
        workerData.forEach(point => allTimestamps.add(point.timestamp))
      })

      const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b)

      return sortedTimestamps.map(timestamp => {
        const dataPoint: any = { timestamp }

        groupWorkers.forEach(workerName => {
          const workerData = getWorkerData(workerName)
          const point = workerData.find(p => p.timestamp === timestamp)
          dataPoint[workerName] = point ? point.raw_hashrate : 0
        })

        return dataPoint
      })
    } else {
      const workerData = getWorkerData(workerName)
      return workerData.map(point => ({
        ...point,
        hashrate: formatHashrate(point.raw_hashrate)
      }))
    }
  }, [isGroup, workerName, getGroupData, getWorkerData, allData])

  const groupWorkers = useMemo(() => {
    if (!isGroup || !allData) return []
    return Object.keys(allData.workers)
      .filter(name => name.startsWith(workerName + '.'))
  }, [isGroup, workerName, allData])

  const getWorkerColor = (index: number): string => {
    const colors = [
      '#00FF26', '#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471',
      '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2', '#A9DFBF', '#FAD7A0'
    ]
    return colors[index % colors.length]
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
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-xl w-full max-w-5xl shadow-2xl">
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
        <div className="p-6" style={{ height: '450px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF26]"></div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Нет данных для отображения</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
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
                <Legend
                  verticalAlign="bottom"
                  height={60}
                  iconType="line"
                  wrapperStyle={{
                    paddingTop: '20px',
                    color: '#9CA3AF',
                    fontSize: '12px',
                    maxHeight: '60px',
                    overflowY: 'auto'
                  }}
                />
                {isGroup ? (
                  groupWorkers.map((worker, index) => (
                    <Line
                      key={worker}
                      type="monotone"
                      dataKey={worker}
                      stroke={getWorkerColor(index)}
                      strokeWidth={2}
                      dot={false}
                      name={worker}
                      activeDot={{
                        r: 3,
                        fill: getWorkerColor(index),
                        stroke: getWorkerColor(index),
                        strokeWidth: 0
                      }}
                    />
                  ))
                ) : (
                  <Line
                    type="monotone"
                    dataKey="raw_hashrate"
                    stroke="#00FF26"
                    strokeWidth={2}
                    dot={false}
                    name={`Хешрейт воркера ${workerName}`}
                    activeDot={{
                      r: 4,
                      fill: '#00FF26',
                      stroke: '#00FF26',
                      strokeWidth: 0
                    }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}