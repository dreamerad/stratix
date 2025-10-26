import { useState } from 'react'
import { X } from 'lucide-react'
import { Toggle } from '@/shared/ui'

interface WorkerSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  workerName: string
}

export function WorkerSettingsModal({ isOpen, onClose, workerName }: WorkerSettingsModalProps) {
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
          <div className="relative bg-[#1a1a1a] border border-gray-600 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Assign a route</h2>
                  <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                      <X className="h-4 w-4"/>
                  </button>
              </div>


              {/* Перенаправление */}
              <div className="mb-4">
                  <h3 className="text-white font-medium mb-3">Redirection</h3>
                  <div className="space-y-3">
                      <input
                          type="text"
                          value={pool}
                          onChange={(e) => setPool(e.target.value)}
                          autoComplete="off"
                          name="pool-address-unique"
                          className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#00FF26] transition-colors"
                          placeholder="Pool"
                      />

                      <input
                          type="text"
                          value={worker}
                          onChange={(e) => setWorker(e.target.value)}
                          autoComplete="off"
                          name="worker-field-unique"
                          className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#00FF26] transition-colors"
                          placeholder="Worker"
                      />

                      <input
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                          name="password-field-unique"
                          data-form-type="other"
                          className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#00FF26] transition-colors"
                          placeholder="Password"
                      />
                  </div>
              </div>

              {/* Настройки */}
              <div className="mb-6">
                  <h3 className="text-white font-medium mb-3">Settings</h3>
                  <div className="space-y-4">
                      <div className="relative">
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
                              className="w-full p-2 pr-8 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#00FF26] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="Percent"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                      </div>

                      <div className="flex items-center justify-between">
                          <div>
                              <label className="block text-white font-medium">Route status</label>
                              <p className="text-gray-400 text-sm">Enable redirection</p>
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
                      onClick={handleSave}
                      className="flex-1 inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden bg-accent-green text-primary-bg hover:bg-accent-green-hover hover:shadow-lg hover:shadow-accent-green/25 focus:ring-accent-green/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%] px-4 py-2 text-base"
                  >
                      <span className="transition-all duration-200">Save</span>
                  </button>

              </div>
          </div>
      </div>
  )
}