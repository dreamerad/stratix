import {useEffect, useState} from 'react'
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import {dashboardMiningApi} from '../../api/mining'
import {useCurrency} from '@/shared/providers/CurrencyProvider'

function CustomTooltip({active, payload}: any) {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="bg-[#2D2D2D] border border-border rounded-lg p-2 md:p-3 shadow-xl">
                <p className="text-[#7A7A7A] text-xs">
                    {data.time}
                </p>
                <p className="text-white text-sm">
                    {data.hashrate} PH/s
                </p>
            </div>
        )
    }
    return null
}

export function HashrateChart() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const {currency} = useCurrency()
    const [selectedPeriod, setSelectedPeriod] = useState<24 | 168 | 720>(24)

    const periodMap = {
        'Day': 24,
        'Week': 168,
        'Month': 720,
        // 'Year': 720
    }

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true)
                const chartData = await dashboardMiningApi.getChartData(currency, selectedPeriod)

                const formattedData = chartData.map(point => ({
                    time: new Date(point.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    hashrate: Math.round(point.rawHashrate / 1e15 * 100) / 100,
                    raw: point.rawHashrate
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

    if (loading) {
        return (
            <div className="bg-[#222222] border border-border rounded-xl p-4 md:p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#222222] border border-border rounded-xl p-4 md:p-6">
            {/* Заголовок */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 md:mb-6">
                <div>
                    <h3 className="text-text-white text-sm mb-1">Total hashrate</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-text-primary font-[600] text-2xl md:text-3xl">
              {currentHashrate} PH/s
            </span>
                        <span className="text-[#00FF26] text-sm flex items-center gap-2">
              {currency}
                            <svg width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13.3334 5.8335H18.3334M18.3334 5.8335V10.8335M18.3334 5.8335L11.2501 12.9168L7.08341 8.75016L1.66675 14.1668"
                    stroke="#00FF26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
                    </div>
                </div>

                {/* Переключатель периодов */}
                <div
                    className="flex items-center bg-primary-bg-secondary rounded-lg p-1 h-[36px] md:h-[40px] w-full sm:w-auto">
                    {Object.entries(periodMap).map(([period, hours], index) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(hours as 24 | 168 | 720)}
                            className={`flex-1 sm:flex-none px-2 md:px-4 py-1 md:py-1.5 text-xs md:text-sm rounded-md transition-colors ${
                                selectedPeriod === hours
                                    ? 'text-[#00FF26] bg-[radial-gradient(circle_at_center,rgba(0,255,38,0.2)_0%,rgba(0,255,38,0)_70%)]'
                                    : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* График */}
            <div className="h-48 sm:h-56 md:h-64 -mx-1 md:-mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5
                    }}>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00FF26" stopOpacity={0.3}/>
                                <stop offset="100%" stopColor="#00FF26" stopOpacity={0}/>
                            </linearGradient>
                        </defs>

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{fill: '#666', fontSize: 12}}
                            width={60}
                        />

                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{fill: '#666', fontSize: 12}}
                            interval="preserveStartEnd"
                        />

                        <Line
                            type="monotone"
                            dataKey="hashrate"
                            stroke="#00FF26"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{r: 4, fill: '#00FF26', stroke: '#1a1a1a', strokeWidth: 2}}
                        />

                        <Tooltip
                            content={<CustomTooltip/>}
                            cursor={{stroke: '#666', strokeWidth: 1, strokeDasharray: '4 4'}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}