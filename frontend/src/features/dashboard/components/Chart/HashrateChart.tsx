import {useEffect, useState} from 'react'
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Brush} from 'recharts'
import {dashboardMiningApi} from '../../api/mining'
import {useCurrency} from '@/shared/providers/CurrencyProvider'
// import {ZoomIn, ZoomOut, Download, Settings} from 'lucide-react'

function CustomTooltip({active, payload}: any) {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="bg-[#1a1a1a] border border-[#00FF26]/20 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-[#00FF26]"></div>
                    <p className="text-[#7A7A7A] text-xs font-medium">
                        {data.time}
                    </p>
                </div>
                <p className="text-white text-sm font-semibold">
                    {data.hashrate} PH/s
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00FF26]/30 to-transparent mt-1"></div>
            </div>
        )
    }
    return null
}

function CustomDot(props: any) {
    const { cx, cy, payload } = props;
    if (!payload) return null;

    return (
        <g>
            {/* Внешнее свечение */}
            <circle
                cx={cx}
                cy={cy}
                r={8}
                fill="#00FF26"
                opacity={0.1}
                className="animate-pulse"
            />
            {/* Основная точка */}
            <circle
                cx={cx}
                cy={cy}
                r={4}
                fill="#00FF26"
                stroke="#1a1a1a"
                strokeWidth={2}
                className="drop-shadow-sm"
            />
            {/* Внутренний блик */}
            <circle
                cx={cx}
                cy={cy}
                r={1.5}
                fill="#ffffff"
                opacity={0.8}
            />
        </g>
    );
}

export function HashrateChart() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const {currency} = useCurrency()
    const [selectedPeriod, setSelectedPeriod] = useState<24 | 168 | 720>(24)
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [zoomDomain, setZoomDomain] = useState<{startIndex?: number, endIndex?: number}>({})
    const [showBrush, setShowBrush] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    // Настройки графика
    const [chartSettings, setChartSettings] = useState({
        showGrid: true,
        showArea: true,
        lineThickness: 2.5,
        showAnimation: true
    })

    const periodMap = {
        'Day': 24,
        'Week': 168,
        'Month': 720,
    }

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    const resetZoom = () => {
        setZoomDomain({})
        setShowBrush(false)
    }

    const enableZoom = () => {
        setShowBrush(true)
    }

    const exportChart = () => {
        const exportData = {
            currency,
            period: selectedPeriod,
            timestamp: new Date().toISOString(),
            data: data.map(d => ({
                time: d.time,
                hashrate: d.hashrate,
                raw: d.raw
            }))
        }

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `hashrate-${currency}-${selectedPeriod}h-${new Date().getTime()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true)
                const chartData = await dashboardMiningApi.getChartData(currency, selectedPeriod)

                const formattedData = chartData.map((point, index) => ({
                    time: new Date(point.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    hashrate: Math.round(point.rawHashrate / 1e15 * 100) / 100,
                    raw: point.rawHashrate,
                    index
                }))

                setData(formattedData)
            } catch (error) {
                console.error('Failed to fetch chart data:', error)
                setData([])
            } finally {
                setLoading(false)
            }
        }

        fetchChartData()
    }, [currency, selectedPeriod])

    const currentHashrate = data[data.length - 1]?.hashrate || 0
    const previousHashrate = data[data.length - 2]?.hashrate || 0
    const trend = currentHashrate > previousHashrate ? 'up' : currentHashrate < previousHashrate ? 'down' : 'stable'

    if (loading) {
        return (
            <div className="bg-[#222222] border border-border rounded-xl p-4 md:p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00FF26]/20"></div>
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-[#00FF26] absolute top-0"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-[#222222] border border-border rounded-xl p-4 md:p-6 relative overflow-hidden transition-all duration-300 ${
            isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''
        }`}>
            {/* Фоновый градиент */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FF26]/5 via-transparent to-[#00FF26]/3 pointer-events-none"></div>

            {/* Заголовок с кнопками управления */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 md:mb-6 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-text-white text-sm mb-1 font-medium">Total hashrate</h3>

                        {/* Кнопки управления */}
                        <div className="flex items-center gap-2">
                            {/*<button*/}
                            {/*    onClick={() => setShowSettings(!showSettings)}*/}
                            {/*    className="p-2 text-gray-400 hover:text-[#00FF26] hover:bg-[#00FF26]/10 rounded-lg transition-all duration-200"*/}
                            {/*    title="Настройки"*/}
                            {/*>*/}
                            {/*    <Settings className="h-4 w-4" />*/}
                            {/*</button>*/}

                            {/*<button*/}
                            {/*    onClick={showBrush ? resetZoom : enableZoom}*/}
                            {/*    className="p-2 text-gray-400 hover:text-[#00FF26] hover:bg-[#00FF26]/10 rounded-lg transition-all duration-200"*/}
                            {/*    title={showBrush ? "Сбросить зум" : "Включить зум"}*/}
                            {/*>*/}
                            {/*    {showBrush ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}*/}
                            {/*</button>*/}

                            {/*<button*/}
                            {/*    onClick={exportChart}*/}
                            {/*    className="p-2 text-gray-400 hover:text-[#00FF26] hover:bg-[#00FF26]/10 rounded-lg transition-all duration-200"*/}
                            {/*    title="Экспорт данных"*/}
                            {/*>*/}
                            {/*    <Download className="h-4 w-4" />*/}
                            {/*</button>*/}

                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-text-primary font-[600] text-2xl md:text-3xl">
                            {currentHashrate} PH/s
                        </span>
                        <span className={`text-sm flex items-center gap-2 ${
                            trend === 'up' ? 'text-[#00FF26]' : 
                            trend === 'down' ? 'text-red-400' : 
                            'text-gray-400'
                        }`}>
                            {currency}
                            <svg width="16" height="16" className={`md:w-5 md:h-5 transition-transform ${
                                trend === 'down' ? 'rotate-180' : ''
                            }`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.3334 5.8335H18.3334M18.3334 5.8335V10.8335M18.3334 5.8335L11.2501 12.9168L7.08341 8.75016L1.66675 14.1668"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Переключатель периодов */}
                <div className="flex items-center bg-primary-bg-secondary rounded-lg p-1 h-[36px] md:h-[40px] w-full sm:w-auto border border-border/50">
                    {Object.entries(periodMap).map(([period, hours]) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(hours as 24 | 168 | 720)}
                            className={`flex-1 sm:flex-none px-2 md:px-4 py-1 md:py-1.5 text-xs md:text-sm rounded-md transition-all duration-200 ${
                                selectedPeriod === hours
                                    ? 'text-[#00FF26] bg-[radial-gradient(circle_at_center,rgba(0,255,38,0.2)_0%,rgba(0,255,38,0)_70%)] shadow-sm'
                                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                            }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Панель настроек */}
            {showSettings && (
                <div className="mb-4 p-4 bg-[#1a1a1a] border border-[#00FF26]/20 rounded-lg animate-slideDown">
                    <h4 className="text-sm font-medium text-white mb-3">Настройки графика</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={chartSettings.showGrid}
                                onChange={(e) => setChartSettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                                className="w-4 h-4 accent-[#00FF26]"
                            />
                            Показать сетку
                        </label>

                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={chartSettings.showArea}
                                onChange={(e) => setChartSettings(prev => ({ ...prev, showArea: e.target.checked }))}
                                className="w-4 h-4 accent-[#00FF26]"
                            />
                            Заливка области
                        </label>

                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={chartSettings.showAnimation}
                                onChange={(e) => setChartSettings(prev => ({ ...prev, showAnimation: e.target.checked }))}
                                className="w-4 h-4 accent-[#00FF26]"
                            />
                            Анимации
                        </label>

                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span>Толщина линии:</span>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="0.5"
                                value={chartSettings.lineThickness}
                                onChange={(e) => setChartSettings(prev => ({ ...prev, lineThickness: parseFloat(e.target.value) }))}
                                className="flex-1 accent-[#00FF26]"
                            />
                            <span className="w-6 text-xs">{chartSettings.lineThickness}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* График */}
            <div className={`-mx-1 md:-mx-2 relative ${
                isFullscreen ? 'h-[calc(100vh-250px)]' : 'h-48 sm:h-56 md:h-64'
            }`}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 10, bottom: showBrush ? 50 : 10 }}
                        onMouseMove={(e) => {
                            if (e && e.activeTooltipIndex !== undefined) {
                                setHoveredPoint(e.activeTooltipIndex)
                            }
                        }}
                        onMouseLeave={() => setHoveredPoint(null)}
                    >
                        <defs>
                            {/* Основной градиент заливки */}
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00FF26" stopOpacity={chartSettings.showArea ? 0.3 : 0}/>
                                <stop offset="30%" stopColor="#00FF26" stopOpacity={chartSettings.showArea ? 0.15 : 0}/>
                                <stop offset="100%" stopColor="#00FF26" stopOpacity={0}/>
                            </linearGradient>

                            {/* Градиент для линии */}
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#00FF26" stopOpacity={0.8}/>
                                <stop offset="50%" stopColor="#00FF26" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#00FF26" stopOpacity={0.8}/>
                            </linearGradient>

                            {/* Фильтр для свечения */}
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Сетка */}
                        {chartSettings.showGrid && (
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#333333"
                                strokeOpacity={0.3}
                                vertical={false}
                            />
                        )}

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
                            width={60}
                            tickFormatter={(value) => `${value}`}
                            domain={zoomDomain.startIndex !== undefined ? ['dataMin', 'dataMax'] : [0, 'dataMax + 1']}
                        />

                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
                            interval="preserveStartEnd"
                        />

                        {/* Область под графиком */}
                        <Area
                            type="monotone"
                            dataKey="hashrate"
                            stroke="url(#lineGradient)"
                            strokeWidth={chartSettings.lineThickness}
                            fill="url(#areaGradient)"
                            dot={false}
                            activeDot={<CustomDot />}
                            filter={chartSettings.showAnimation ? "url(#glow)" : undefined}
                            animationDuration={chartSettings.showAnimation ? 1000 : 0}
                        />

                        {/* Brush для зума */}
                        {showBrush && (
                            <Brush
                                dataKey="time"
                                height={30}
                                stroke="#00FF26"
                                fill="rgba(0, 255, 38, 0.1)"
                                onChange={(brushData) => {
                                    if (brushData) {
                                        setZoomDomain({
                                            startIndex: brushData.startIndex,
                                            endIndex: brushData.endIndex
                                        })
                                    }
                                }}
                            />
                        )}

                        <Tooltip
                            content={<CustomTooltip/>}
                            cursor={{
                                stroke: '#00FF26',
                                strokeWidth: 1,
                                strokeDasharray: '4 4',
                                opacity: 0.6
                            }}
                            position={{ x: undefined, y: -10 }}
                            allowEscapeViewBox={{ x: false, y: true }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Индикаторы статистики */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#00FF26]"></div>
                        Hashrate
                    </span>
                    {data.length > 0 && (
                        <span>
                            {data.length} точек данных
                        </span>
                    )}
                    {showBrush && zoomDomain.startIndex !== undefined && (
                        <span className="text-[#00FF26]">
                            Зум активен ({zoomDomain.startIndex}-{zoomDomain.endIndex})
                        </span>
                    )}
                </div>

                {hoveredPoint !== null && (
                    <div className="text-xs text-text-muted">
                        Точка {hoveredPoint + 1} из {data.length}
                    </div>
                )}
            </div>

            {/* Overlay для полноэкранного режима */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40"
                    onClick={toggleFullscreen}
                />
            )}
        </div>
    )
}