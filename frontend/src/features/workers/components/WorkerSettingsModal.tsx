import {useState} from 'react'
import {X} from 'lucide-react'
import {Toggle} from '@/shared/ui'

interface WorkerSettingsModalProps {
    isOpen: boolean
    onClose: () => void
    workerName: string
}

interface ToggleProps {
    checked: boolean
    onChange: (checked: boolean) => void
}

export function WorkerSettingsModal({isOpen, onClose, workerName}: WorkerSettingsModalProps) {
    const [workerNameEdit, setWorkerNameEdit] = useState(workerName)
    const [pool, setPool] = useState('')
    const [worker, setWorker] = useState('')
    const [password, setPassword] = useState('')
    const [percentage, setPercentage] = useState('30')
    const [routeStatus, setRouteStatus] = useState(false)

    const handleSave = () => {
        console.log('Saving worker settings:', {
            workerName: workerNameEdit,
            pool,
            worker,
            password,
            percentage,
            routeStatus
        })
        onClose()
    }

    const handleCancel = () => {
        // Сброс значений
        setWorkerNameEdit(workerName)
        setPool('')
        setWorker('')
        setPassword('')
        setPercentage('30')
        setRouteStatus(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div
                className="relative bg-[#1a1a1a] border border-gray-600 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Назначить маршрут</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="h-4 w-4"/>
                    </button>
                </div>

                {/* Источник хешрейта */}
                <div className="mb-4">
                    <h3 className="text-white font-medium mb-3">Источник хешрейта</h3>
                    <div className="flex items-center gap-3">
                        <label className="text-gray-300 text-sm w-20">Воркер:</label>
                        <input
                            type="text"
                            value={workerNameEdit}
                            onChange={(e) => setWorkerNameEdit(e.target.value)}
                            autoComplete="off"
                            name="worker-name-unique"
                            className="flex-1 p-2 bg-gray border rounded-lg text-white focus:outline-none focus:border-[#00FF26] transition-colors"
                        />
                    </div>
                </div>

                {/* Перенаправление */}
                <div className="mb-4">
                    <h3 className="text-white font-medium mb-3">Перенаправление</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <label className="text-gray-300 text-sm w-20">Пул:</label>
                            <input
                                type="text"
                                value={pool}
                                onChange={(e) => setPool(e.target.value)}
                                autoComplete="off"
                                name="pool-address-unique"
                                className="flex-1 p-2 bg-gray border rounded-lg text-white focus:outline-none focus:border-[#00FF26] transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-gray-300 text-sm w-20">Воркер:</label>
                            <input
                                type="text"
                                value={worker}
                                onChange={(e) => setWorker(e.target.value)}
                                autoComplete="off"
                                name="worker-field-unique"
                                className="flex-1 p-2 bg-gray border rounded-lg text-white focus:outline-none focus:border-[#00FF26] transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="text-gray-300 text-sm w-20">Пароль:</label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                name="password-field-unique"
                                data-form-type="other"
                                className="flex-1 p-2 bg-gray border rounded-lg text-white focus:outline-none focus:border-[#00FF26] transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Настройки */}
                <div className="mb-6">
                    <h3 className="text-white font-medium mb-3">Настройки</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <label className="text-gray-300 text-sm w-20">Процент:</label>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    value={percentage}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '')
                                        const numValue = parseInt(value) || 0
                                        if (numValue <= 100) {
                                            setPercentage(value)
                                        }
                                    }}
                                    autoComplete="off"
                                    name="percentage-unique"
                                    className="flex-1 p-2 bg-gray border rounded-lg text-white focus:outline-none focus:border-[#00FF26] transition-colors"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                            </div>
                        </div>

                        <div
                            className="flex items-center justify-between p-3 bg-gray rounded-lg border border-gray-600">
                            <div>
                                <label className="block text-white font-medium">Статус маршрута</label>
                                <p className="text-gray-400 text-sm">Включить перенаправление</p>
                            </div>
                            <Toggle
                                checked={routeStatus}
                                onChange={setRouteStatus}
                            />

                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleCancel}
                        className="flex-1 py-2 px-4 bg-gray-800 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSave}
                        className="relative flex-1 flex items-center justify-center py-2 px-4 bg-black text-white font-medium rounded-lg hover:opacity-90 transition-opacity overflow-hidden"
                    >
                        {/* Зеленые акценты в углах */}
                        <div
                            className="absolute top-0 left-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>
                        <div
                            className="absolute bottom-0 right-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>

                        <span className="relative z-10">Сохранить</span>
                    </button>
                </div>
            </div>
        </div>
    )
}