import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid, Brush } from 'recharts'
import { useAllWorkersHistory } from '../hooks/useAllWorkersHistory'

interface WorkerChartModalProps {
  isOpen: boolean
  onClose: () => void
  workerName: string
  isGroup?: boolean
}

type TimeRange = 1 | 6 | 24 | 48 | 168

export function WorkerChartModal({ isOpen, onClose, workerName, isGroup = false }: WorkerChartModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showBrush, setShowBrush] = useState(false)

  const [chartSettings] = useState({
    showGrid: true,
    showArea: !isGroup,
    lineThickness: 2.5,
    showAnimation: true,
    chartType: isGroup ? 'line' : 'area' as 'line' | 'area'
  })

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

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

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
        <div className="bg-[#1a1a1a] border border-[#00FF26]/20 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF26]"></div>
            <p className="text-[#7A7A7A] text-xs font-medium">
              {formatTimestamp(label)}
            </p>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span className="text-gray-300 text-sm">{entry.name || 'Hashrate'}:</span>
              <span className="text-white font-semibold">
                {formatHashrate(entry.value)}
              </span>
            </div>
          ))}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00FF26]/30 to-transparent mt-2"></div>
        </div>
      )
    }
    return null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-[#1a1a1a] border border-gray-600 rounded-xl shadow-2xl transition-all duration-300 relative overflow-hidden ${
        isFullscreen ? 'w-full h-full max-w-none max-h-none' : 'w-full max-w-6xl max-h-[90vh]'
      }`}>

        {/* Фоновый градиент */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF26]/5 via-transparent to-[#00FF26]/3 pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600 relative z-10">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isGroup ? `Группа: ${workerName}` : `Воркер: ${workerName}`}
                </h2>
                <p className="text-gray-400 text-sm">История хешрейта ({currency})</p>
              </div>

              {/* Кнопки управления */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex gap-2 flex-wrap">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedTimeRange(range.value)}
                className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  selectedTimeRange === range.value
                    ? 'bg-[#00FF26] text-black font-medium shadow-sm'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className={`p-6 ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[450px]'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00FF26]/20"></div>
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-[#00FF26] absolute top-0"></div>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Нет данных для отображения</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartSettings.chartType === 'area' && !isGroup ? (
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 20, bottom: showBrush ? 80 : 60 }}
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00FF26" stopOpacity={chartSettings.showArea ? 0.3 : 0}/>
                      <stop offset="30%" stopColor="#00FF26" stopOpacity={chartSettings.showArea ? 0.15 : 0}/>
                      <stop offset="100%" stopColor="#00FF26" stopOpacity={0}/>
                    </linearGradient>

                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00FF26" stopOpacity={0.8}/>
                      <stop offset="50%" stopColor="#00FF26" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#00FF26" stopOpacity={0.8}/>
                    </linearGradient>

                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {chartSettings.showGrid && (
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#333333"
                      strokeOpacity={0.3}
                      vertical={false}
                    />
                  )}

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

                  <Area
                    type="monotone"
                    dataKey="raw_hashrate"
                    stroke="url(#lineGradient)"
                    strokeWidth={chartSettings.lineThickness}
                    fill="url(#areaGradient)"
                    dot={false}
                    filter={chartSettings.showAnimation ? "url(#glow)" : undefined}
                    animationDuration={chartSettings.showAnimation ? 1000 : 0}
                  />

                  {showBrush && (
                    <Brush
                      dataKey="timestamp"
                      height={30}
                      stroke="#00FF26"
                      fill="rgba(0, 255, 38, 0.1)"
                      tickFormatter={formatTimestamp}
                    />
                  )}

                  <Tooltip content={<CustomTooltip />} />
                </AreaChart>
              ) : (
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 20, bottom: showBrush ? 80 : 60 }}
                >
                  {chartSettings.showGrid && (
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#333333"
                      strokeOpacity={0.3}
                      vertical={false}
                    />
                  )}

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
                    height={isGroup ? 60 : 40}
                    iconType="line"
                    wrapperStyle={{
                      paddingTop: '20px',
                      color: '#9CA3AF',
                      fontSize: '12px',
                      maxHeight: isGroup ? '60px' : 'auto',
                      overflowY: isGroup ? 'auto' : 'visible'
                    }}
                  />

                  {isGroup ? (
                    groupWorkers.map((worker, index) => (
                      <Line
                        key={worker}
                        type="monotone"
                        dataKey={worker}
                        stroke={getWorkerColor(index)}
                        strokeWidth={chartSettings.lineThickness}
                        dot={false}
                        name={worker}
                        animationDuration={chartSettings.showAnimation ? 1000 : 0}
                      />
                    ))
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="raw_hashrate"
                      stroke="#00FF26"
                      strokeWidth={chartSettings.lineThickness}
                      dot={false}
                      name={`Хешрейт воркера ${workerName}`}
                      animationDuration={chartSettings.showAnimation ? 1000 : 0}
                    />
                  )}

                  {showBrush && (
                    <Brush
                      dataKey="timestamp"
                      height={30}
                      stroke="#00FF26"
                      fill="rgba(0, 255, 38, 0.1)"
                      tickFormatter={formatTimestamp}
                    />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Overlay для полноэкранного режима */}
        {isFullscreen && (
          <div
            className="fixed inset-0 bg-black/80 z-30"
            onClick={toggleFullscreen}
          />
        )}
      </div>
    </div>
  )
}