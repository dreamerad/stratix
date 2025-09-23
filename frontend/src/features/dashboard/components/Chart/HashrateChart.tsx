import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
// Моковые данные для графика
const mockData = [
  { time: '04:00:00', hashrate: 1000, timestamp: '2025-01-15 04:00:00' },
  { time: '05:00:00', hashrate: 1200, timestamp: '2025-01-15 05:00:00' },
  { time: '06:00:00', hashrate: 1400, timestamp: '2025-01-15 06:00:00' },
  { time: '07:00:00', hashrate: 1600, timestamp: '2025-01-15 07:00:00' },
  { time: '08:00:00', hashrate: 1800, timestamp: '2025-01-15 08:00:00' },
  { time: '09:00:00', hashrate: 2000, timestamp: '2025-01-15 09:00:00' },
  { time: '10:00:00', hashrate: 2200, timestamp: '2025-01-15 10:00:00' }
]

// Кастомный Tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
        <div className="bg-[#2D2D2D] border border-border rounded-lg p-3 shadow-xl">
            <p className="text-[#7A7A7A] text-xs mt-1">
                {data.time}
            </p>
            <p className="text-white text-sm mt-1">
                {data.hashrate} PH/s
            </p>

        </div>
    )
  }
    return null
}

export function HashrateChart() {
    const currentHashrate = mockData[mockData.length - 1]?.hashrate || 2344.43

  return (
    <div className="bg-[#222222] border border-border rounded-xl p-6">
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-text-white text-sm mb-1">Total hashrate</h3>
          <div className="flex items-center gap-2">
            <span className="text-text-primary font-[600] text-3xl">
              {currentHashrate} PH/s
            </span>
              <span className="text-[#00FF26] text-sm flex items-center gap-2">
              +11.01%
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
      d="M13.3334 5.8335H18.3334M18.3334 5.8335V10.8335M18.3334 5.8335L11.2501 12.9168L7.08341 8.75016L1.66675 14.1668"
      stroke="#00FF26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

            </span>
          </div>
        </div>

          {/* Переключатель периодов */}
          <div className="flex items-center bg-primary-bg-secondary rounded-lg p-1 h-[40px]">
              {['Day', 'Week', 'Month', 'Year'].map((period, index) => (
                  <button
                      key={period}
                      className={`px-4 py-1.5 text-sm  ${
                          index === 0
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
        <div className="h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData} margin={{top: 5, right: 5, left: 5, bottom: 5}}>
                    {/* Градиент для заливки под линией */}
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00FF26" stopOpacity={0.3}/>
      <stop offset="100%" stopColor="#00FF26" stopOpacity={0}/>
    </linearGradient>
  </defs>

  {/* Сетка по Y */}
  <YAxis
    domain={[0, 2500]}
    ticks={[0, 500, 1000, 1500, 2000]}
    axisLine={false}
    tickLine={false}
    tick={{ fill: '#666', fontSize: 12 }}
    tickFormatter={(value) => `${value} TH/s`}
  />
                {/* Градиент для заливки под линией */}


                {/* Ось X */}
                <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#666', fontSize: 12}}
                    interval={0}
                    tickCount={7}
                />


                {/* Основная линия */}
                <Line
                    type="monotone"
                    dataKey="hashrate"
                    stroke="#00FF26"
                    strokeWidth={1}
                    dot={false}
                    fill="url(#colorGradient)"
                    fillOpacity={1}
                    activeDot={{
                        r: 4,
                        fill: '#00FF26',
                        stroke: '#1a1a1a',
                        strokeWidth: 2
                    }}
                />

                {/* Кастомный Tooltip */}
                <Tooltip
                    content={<CustomTooltip/>}
                    cursor={{
                        stroke: '#666',
                        strokeWidth: 1,
                        strokeDasharray: '4 4'
                    }}
                    wrapperStyle={{outline: 'none'}}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
      </div>

        {/* Подпись времени внизу */}
    </div>
  )
}