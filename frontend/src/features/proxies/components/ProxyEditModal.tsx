import {useEffect, useState} from 'react'
import {AnimatedModal, Button} from '@/shared/ui'
import type {Proxy} from '../api/proxies'
import {proxiesApi} from '../api/proxies'

interface ProxyEditModalProps {
    isOpen: boolean
    onClose: () => void
    proxy: Proxy | null
}

interface FeeFormData {
    worker: string
    percent: number
}

interface AccountFeeData {
    worker: string
    percent: number
}

interface AccountData {
    id: string
    accountName: string
    fees: AccountFeeData[]
}

export function ProxyEditModal({isOpen, onClose, proxy}: ProxyEditModalProps) {
    const [proxyId, setProxyId] = useState('')
    const [fees, setFees] = useState<FeeFormData[]>([])
    const [accounts, setAccounts] = useState<AccountData[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen && proxy) {
            setProxyId(proxy.proxy_id)

            // Парсим основные fee настройки
            const feeData = proxy.config['sha256-stratum'].debug.fee.map(fee => ({
                worker: fee.worker,
                percent: fee.percent
            }))
            setFees(feeData)

            const accountFees = proxy.config['sha256-stratum'].debug.account_fees || {}
            const accountsData = Object.entries(accountFees).map(([accountKey, feeArray]: [string, any[]], index) => ({
                id: `account_${Date.now()}_${index}`,
                accountName: accountKey,
                fees: feeArray.map(feeData => ({
                    worker: feeData.worker,
                    percent: feeData.percent
                }))
            }))

            setAccounts(accountsData)
        }
    }, [isOpen, proxy])

    const handleClose = () => {
        setProxyId('')
        setFees([])
        setAccounts([])
        setIsSubmitting(false)
        onClose()
    }

    const addFee = () => {
        setFees([...fees, {
            worker: 'viabtc.fee1',
            percent: 1
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

    const addAccount = () => {
        const newAccount: AccountData = {
            id: `account_${Date.now()}`,
            accountName: `clientworker${accounts.length + 1}`,
            fees: []
        }
        setAccounts([newAccount, ...accounts])
    }

    const removeAccount = (accountId: string) => {
        setAccounts(accounts.filter(acc => acc.id !== accountId))
    }

    const updateAccountName = (accountId: string, name: string) => {
        setAccounts(accounts.map(acc =>
            acc.id === accountId ? {...acc, accountName: name} : acc
        ))
    }

    const addFeeToAccount = (accountId: string) => {
        const newFee: AccountFeeData = {
            worker: 'user.worker1',
            percent: 0
        }

        setAccounts(accounts.map(acc =>
            acc.id === accountId
                ? {...acc, fees: [...acc.fees, newFee]}
                : acc
        ))
    }

    const removeFeeFromAccount = (accountId: string, feeIndex: number) => {
        setAccounts(accounts.map(acc =>
            acc.id === accountId
                ? {...acc, fees: acc.fees.filter((_, i) => i !== feeIndex)}
                : acc
        ))
    }

    const updateAccountFee = (accountId: string, feeIndex: number, field: keyof AccountFeeData, value: string | number) => {
        setAccounts(accounts.map(acc =>
            acc.id === accountId
                ? {
                    ...acc,
                    fees: acc.fees.map((fee, i) =>
                        i === feeIndex ? {...fee, [field]: value} : fee
                    )
                }
                : acc
        ))
    }

    const handleSave = async () => {
        if (!proxyId.trim()) {
            return
        }

        setIsSubmitting(true)

        try {
            const transformedFees = fees.map(fee => ({
                worker: fee.worker,
                percent: fee.percent
            }))

            const accountFeesObject: Record<string, any[]> = {}
            accounts.forEach((account) => {
                if (account.fees.length > 0) {
                    accountFeesObject[account.accountName] = account.fees.map(fee => ({
                        worker: fee.worker,
                        percent: fee.percent
                    }))
                }
            })

            const proxyData = {
                config: {
                    "sha256-stratum": {
                        debug: {
                            fee: transformedFees,
                            custom: {
                                premium_user: 0.5,
                                standard_user: 2,
                                trial_user: 3,
                                free_account: 0
                            },
                            account_fees: accountFeesObject
                        }
                    }
                },
                proxy_id: proxyId
            }

            const response = await proxiesApi.updateProxy(proxyData)

            if (response.success) {
                handleClose()
            } else {
                console.error('Proxy update failed:', response.message)
            }

        } catch (error: any) {
            console.error('Error saving proxy:', error)
            console.error('Error details:', error.response?.data)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={handleClose}
            title={`${proxy?.proxy_id || ''}`}
            className="!w-[90vw] !max-w-[900px] max-h-[95vh] overflow-hidden flex flex-col"
        >
            <div className="flex flex-col h-full max-h-[95vh]">
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="max-w-[800px] mx-auto space-y-6">

                        {/* Fee Settings Section */}
                        <div className="bg-[#222222] rounded-lg p-6 border border-border">
                            <div className="flex items-center justify-between mb-4">
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
                                    Добавить Fee
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
                                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor"
                                                          strokeWidth="1.5"
                                                          strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    className="block text-text-muted text-sm flex items-center gap-2">
                                                    <svg width="24" height="24" viewBox="0 0 271.64 277.95"
                                                         className="flex-shrink-0">
                                                        <path fill="#52cbca"
                                                              d="M215.67,62l-.86,1.06-.94-1a107.68,107.68,0,0,0-65-32.89l-1.06-.13V0l1.33.14A136.72,136.72,0,0,1,239.68,47.8l1.52,1.79-2.34.19A33.19,33.19,0,0,0,215.67,62Z"/>
                                                        <path fill="#52cbca"
                                                              d="M266.1,104.53l1.53-1.73.54,2.25a127.73,127.73,0,0,1,3.47,30.37,135.72,135.72,0,0,1-14.38,60.46l-.63,1.24-23.88-16.69.43-.92a103.84,103.84,0,0,0,9.65-44.09,105.69,105.69,0,0,0-1.56-18.27l-.24-1.34,1.36-.07A33.77,33.77,0,0,0,266.1,104.53Z"/>
                                                        <path fill="#52cbca"
                                                              d="M28.8,135.42a103.7,103.7,0,0,0,9.66,44.09l.43.92L15,197.11l-.63-1.22A131.4,131.4,0,0,1,0,135.42a138.42,138.42,0,0,1,2.93-28l.43-2.07,1.56,1.43a34.06,34.06,0,0,0,22.68,8.92h3l-.25,1.41A105.7,105.7,0,0,0,28.8,135.42Z"/>
                                                        <path fill="#52cbca"
                                                              d="M56.47,63.64l-1,1.12-.87-1.22A34.22,34.22,0,0,0,32.68,49.77l-2.07-.35L32,47.81A135,135,0,0,1,122.51.14L123.83,0V29.06l-1.07.13A106.75,106.75,0,0,0,56.47,63.64Z"/>
                                                        <path fill="#52cbca"
                                                              d="M51.33,201.1l.7.87a107.52,107.52,0,0,0,53.25,36l1.34.4-.59,1.27a34.56,34.56,0,0,0-3.32,14.53,33.92,33.92,0,0,0,2,11.47l.76,2.11-2.18-.54a135.19,135.19,0,0,1-74.84-48.73l-.77-1Z"/>
                                                        <path fill="#52cbca"
                                                              d="M165.61,239.67l-.6-1.27,1.35-.4a107.54,107.54,0,0,0,53.24-36l.71-.87,23.61,16.41-.78,1a136.55,136.55,0,0,1-74.83,48.73l-2.18.54.76-2.11a33.92,33.92,0,0,0,2-11.47A34.72,34.72,0,0,0,165.61,239.67Z"/>
                                                        <path fill="#52cbca"
                                                              d="M241.4,106.39a23.76,23.76,0,1,1,23.75-23.76A23.76,23.76,0,0,1,241.4,106.39Zm-213.8,0A23.76,23.76,0,1,1,51.36,82.63,23.76,23.76,0,0,1,27.6,106.39ZM135.82,278a23.76,23.76,0,1,1,23.75-23.75A23.75,23.75,0,0,1,135.82,278Z"/>
                                                        <path fill="#ffb900"
                                                              d="M169.08,112.72c-4.23,17.16-30.62,8.45-39.33,6.34L137.4,89c8.45,1.84,35.9,6.07,31.68,23.75Zm-4.76,48.83c-4.75,19-36.42,8.71-46.71,6.07l8.44-33.26c10,2.64,43,7.66,38.27,27.19Zm4.23-83.41,6.07-24.81-15.05-4L153.5,73.66c-4-1.06-7.92-1.85-12.14-2.91l6.07-24.28-15-3.69-6.34,24.81c-3.17-.8-6.6-1.59-9.76-2.12L95.43,60.2l-4,16.1,11.08,2.64c6.07,1.58,7.13,5.54,7.13,8.71l-7.13,28.24c.53.26,1.06.26,1.58.53-.52-.27-1-.27-1.58-.53l-9.77,39.85c-.79,1.85-2.63,4.76-6.86,3.7.27.26-11.08-2.64-11.08-2.64l-7.66,17.42L86.72,179c3.7,1.06,7.13,1.85,10.83,2.91L91.21,207l15.05,3.7,6.33-24.82c4,1.06,8.18,2.12,12.14,3.17l-6.33,24.55,15,3.69,6.34-25.07c25.86,4.75,45.13,2.9,53.31-20.32,6.6-18.74-.26-29.83-14-36.69,10.29-2.11,17.68-8.71,19.79-22.17C201.54,94.51,187.55,84.74,168.55,78.14Z"/>
                                                    </svg>
                                                    Воркер
                                                </label>
                                                <input
                                                    type="text"
                                                    value={fee.worker}
                                                    onChange={(e) => updateFee(index, 'worker', e.target.value)}
                                                    className="w-full p-3 bg-primary-card border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-green transition-colors"
                                                    placeholder="viabtc.fee1"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-text-muted text-sm">Процент</label>
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
                                        <p className="mb-2">Нет настроек fee</p>
                                        <Button variant="secondary" onClick={addFee}>Добавить первую настройку
                                            fee</Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Account Settings Section */}
                        <div className="bg-[#222222] rounded-lg p-6 border border-border">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-text-primary text-lg font-semibold">Настройки аккаунтов</h2>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={addAccount}
                                    leftIcon={
                                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                            <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="currentColor"
                                                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    }
                                >
                                    Добавить аккаунт
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {accounts.map((account) => (
                                    <div key={account.id} className="bg-primary-bg border border-border rounded-lg p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="space-y-2 flex-1 max-w-xs">
                                                    <label className="block text-text-muted text-sm">Аккаунт</label>
                                                    <input
                                                        type="text"
                                                        value={account.accountName}
                                                        onChange={(e) => updateAccountName(account.id, e.target.value)}
                                                        className="w-full p-3 bg-primary-card border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-green transition-colors"
                                                        placeholder="clientworker1"
                                                    />
                                                </div>
                                                <div className="flex items-end gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => addFeeToAccount(account.id)}
                                                    >
                                                        Добавить fee
                                                    </Button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeAccount(account.id)}
                                                className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded flex items-center justify-center text-red-500 hover:text-red-400 transition-colors ml-4"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor"
                                                          strokeWidth="1.5"
                                                          strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {account.fees.map((fee, feeIndex) => (
                                                <div key={feeIndex}
                                                     className="bg-[#1A1A1A] border border-border/50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-text-primary font-medium">Fee
                                                            #{feeIndex + 1}</h4>
                                                        <button
                                                            onClick={() => removeFeeFromAccount(account.id, feeIndex)}
                                                            className="w-6 h-6 bg-red-500/10 hover:bg-red-500/20 rounded flex items-center justify-center text-red-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                                                                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor"
                                                                      strokeWidth="1.5"
                                                                      strokeLinecap="round"/>
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label
                                                                className="block text-text-muted text-sm">Воркер</label>
                                                            <input
                                                                type="text"
                                                                value={fee.worker}
                                                                onChange={(e) => updateAccountFee(account.id, feeIndex, 'worker', e.target.value)}
                                                                className="w-full p-3 bg-primary-card border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-green transition-colors"
                                                                placeholder="user.worker1"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label
                                                                className="block text-text-muted text-sm">Процент</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    step="0.1"
                                                                    value={fee.percent}
                                                                    onChange={(e) => updateAccountFee(account.id, feeIndex, 'percent', Number(e.target.value))}
                                                                    className="w-full p-3 pr-8 bg-primary-card border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-green transition-colors"
                                                                />
                                                                <span
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {account.fees.length === 0 && (
                                                <div className="text-center py-4 text-text-muted">
                                                    <p className="text-sm opacity-60">Нажмите "Добавить fee" выше для
                                                        добавления настроек</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {accounts.length === 0 && (
                                    <div className="text-center py-4 text-text-muted">
                                        <p className="text-sm opacity-60">Нажмите "Добавить аккаунт" выше для создания
                                            первого аккаунта</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border bg-[#1A1A1A] px-6 py-4 flex items-center justify-between">
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
            </div>
        </AnimatedModal>
    )
}