import {useEffect, useState} from 'react'
import {AnimatedModal, Button} from '@/shared/ui'
import type {Proxy} from '../api/proxies'

interface ProxyEditModalProps {
    isOpen: boolean
    onClose: () => void
    proxy: Proxy | null
    onSave: (proxyData: any) => void
}

interface FeeFormData {
    pool: string
    worker: string
    pass: string
    percent: number
    window_min: number
    window_max: number
}

interface CustomUserFormData {
    userType: string
    percent: number
}

export function ProxyEditModal({isOpen, onClose, proxy, onSave}: ProxyEditModalProps) {
    const [proxyId, setProxyId] = useState('')
    const [fees, setFees] = useState<FeeFormData[]>([])
    const [customUsers, setCustomUsers] = useState<CustomUserFormData[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen && proxy) {
            setProxyId(proxy.proxy_id)

            const feeData = proxy.config['sha256-stratum'].debug.fee.map(fee => ({
                pool: fee.pool,
                worker: fee.worker,
                pass: fee.pass,
                percent: fee.percent,
                window_min: fee.window_min,
                window_max: fee.window_max
            }))
            setFees(feeData)

            const customData = Object.entries(proxy.config['sha256-stratum'].debug.custom).map(([userType, percent]) => ({
                userType,
                percent: Number(percent)
            }))
            setCustomUsers(customData)
        }
    }, [isOpen, proxy])

    const handleClose = () => {
        setProxyId('')
        setFees([])
        setCustomUsers([])
        setIsSubmitting(false)
        onClose()
    }

    const addFee = () => {
        setFees([...fees, {
            pool: '127.0.0.1:3333',
            worker: 'defaultWorker.fee1',
            pass: 'd=65536',
            percent: 1,
            window_min: 600,
            window_max: 900
        }])
    }

    const removeFee = (index: number) => {
        setFees(fees.filter((_, i) => i !== index))
    }

    const updateFee = (index: number, field: keyof FeeFormData, value: string | number) => {
        const updatedFees = fees.map((fee, i) =>
            i === index ? {...fee, [field]: value} : fee
        )
        setFees(updatedFees)
    }

    const addCustomUser = () => {
        setCustomUsers([...customUsers, {
            userType: 'new_user',
            percent: 0
        }])
    }

    const removeCustomUser = (index: number) => {
        setCustomUsers(customUsers.filter((_, i) => i !== index))
    }

    const updateCustomUser = (index: number, field: keyof CustomUserFormData, value: string | number) => {
        const updatedUsers = customUsers.map((user, i) =>
            i === index ? {...user, [field]: value} : user
        )
        setCustomUsers(updatedUsers)
    }

    const handleSave = async () => {
        if (!proxyId.trim()) {
            return
        }

        setIsSubmitting(true)

        try {
            const customObject: Record<string, number> = {}
            customUsers.forEach(user => {
                if (user.userType.trim()) {
                    customObject[user.userType] = user.percent
                }
            })

            const proxyData = {
                config: {
                    "sha256-stratum": {
                        debug: {
                            fee: fees,
                            custom: customObject,
                            account_fees: {}
                        }
                    }
                },
                proxy_id: proxyId
            }

            await onSave(proxyData)
            handleClose()
        } catch (error) {
            console.error('Error saving proxy:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={handleClose}
            title={proxyId}
            maxWidth="lg"
            className="max-h-[95vh] overflow-hidden w-full max-w-4xl flex flex-col"
        >
            <div className="flex-1 overflow-y-auto p-8 space-y-6">


                {/* Fee Settings Section */}
                <div className="bg-[#222222] rounded-lg p-6 border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-text-primary text-lg font-semibold">Fee настройки</h2>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={addFee}
                            leftIcon={
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="currentColor"
                                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            }
                        >
                            Add Fee
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {fees.map((fee, index) => (
                            <div key={index} className="bg-primary-bg border border-border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-text-primary font-medium">Fee #{index + 1}</h4>
                                    <button
                                        onClick={() => removeFee(index)}
                                        className="w-7 h-7 bg-red-500/10 hover:bg-red-500/20 rounded flex items-center justify-center text-red-500 hover:text-red-400 transition-colors"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5"
                                                  strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-text-muted text-sm">Pool</label>
                                        <input
                                            type="text"
                                            value={fee.pool}
                                            onChange={(e) => updateFee(index, 'pool', e.target.value)}
                                            className="w-full p-3 bg-primary-card border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-green transition-colors"
                                            placeholder="127.0.0.1:3333"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-text-muted text-sm">Worker</label>
                                        <input
                                            type="text"
                                            value={fee.worker}
                                            onChange={(e) => updateFee(index, 'worker', e.target.value)}
                                            className="w-full p-3 bg-primary-card border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-green transition-colors"
                                            placeholder="defaultWorker.fee1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-text-muted text-sm">Password</label>
                                        <input
                                            type="text"
                                            value={fee.pass}
                                            onChange={(e) => updateFee(index, 'pass', e.target.value)}
                                            className="w-full p-3 bg-primary-card border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-green transition-colors"
                                            placeholder="d=65536"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-text-muted text-sm">%</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={fee.percent}
                                                onChange={(e) => updateFee(index, 'percent', Number(e.target.value))}
                                                className="w-full p-3 pr-8 bg-primary-card border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-green transition-colors"
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {fees.length === 0 && (
                            <div className="text-center py-6 text-text-muted">
                                <p className="mb-2">No fee settings configured</p>
                                <Button variant="secondary" onClick={addFee}>Add your first fee setting</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Types Section */}
                <div className="bg-[#222222] rounded-lg p-6 border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-text-primary text-lg font-semibold">Custom настройки пользователей</h2>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={addCustomUser}
                            leftIcon={
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="currentColor"
                                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            }
                        >
                            Add User Type
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {customUsers.map((user, index) => (
                            <div key={index} className="bg-primary-bg border border-border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-text-primary font-medium">User Type #{index + 1}</h4>
                                    <button
                                        onClick={() => removeCustomUser(index)}
                                        className="w-7 h-7 bg-red-500/10 hover:bg-red-500/20 rounded flex items-center justify-center text-red-500 hover:text-red-400 transition-colors"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5"
                                                  strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-text-muted text-sm">Тип пользователя</label>
                                        <input
                                            type="text"
                                            value={user.userType}
                                            onChange={(e) => updateCustomUser(index, 'userType', e.target.value)}
                                            className="w-full p-3 bg-primary-card border border-border rounded text-text-primary focus:outline-none focus:border-accent-green transition-colors"
                                            placeholder="e.g. premium_user, trial_user"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-text-muted text-sm">%</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={user.percent}
                                                onChange={(e) => updateCustomUser(index, 'percent', Number(e.target.value))}
                                                className="w-full p-3 pr-8 bg-primary-card border border-border rounded text-text-primary focus:outline-none focus:border-accent-green transition-colors"
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {customUsers.length === 0 && (
                            <div className="text-center py-6 text-text-muted">
                                <p className="mb-2">No custom user types configured</p>
                                <Button variant="secondary" onClick={addCustomUser}>Add your first user type</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fixed Footer */}
            <div
                className="sticky bottom-0 border-t border-border bg-[#1A1A1A] px-8 py-6 flex items-center justify-between">
                <div className="text-text-muted text-sm">
                    Изменения будут применены после сохранения.
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        isLoading={isSubmitting}
                        disabled={!proxyId.trim() || isSubmitting}
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        </AnimatedModal>
    )
}