import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/entities/auth/store/authStore'
import { useToastHelpers } from '@/shared/ui/Toast'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const changePassword = useAuthStore((state) => state.changePassword)
  const { isLoading, error, clearError } = useAuthStore()

  const { success, error: showError } = useToastHelpers()

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    if (password.length < 8) {
      errors.push('Минимум 8 символов')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Минимум 1 заглавная буква')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Минимум 1 строчная буква')
    }
    if (!/\d/.test(password)) {
      errors.push('Минимум 1 цифра')
    }
    return errors
  }

  const passwordErrors = validatePassword(newPassword)
  const isPasswordValid = newPassword && passwordErrors.length === 0

  const handleSave = async () => {
    if (!currentPassword.trim()) {
      showError('Поле обязательно', 'Введите текущий пароль')
      return
    }

    if (!newPassword.trim()) {
      showError('Поле обязательно', 'Введите новый пароль')
      return
    }

    if (passwordErrors.length > 0) {
      showError('Неверный пароль', 'Новый пароль не соответствует требованиям')
      return
    }

    if (newPassword !== confirmPassword) {
      showError('Пароли не совпадают', 'Убедитесь, что пароли введены одинаково')
      return
    }

    if (newPassword === currentPassword) {
      showError('Одинаковые пароли', 'Новый пароль должен отличаться от текущего')
      return
    }

    try {
      await changePassword(currentPassword, newPassword)
      success('Пароль изменен', 'Новый пароль успешно установлен')
      handleCancel()
    } catch (error) {
      showError('Ошибка смены пароля', 'Не удалось изменить пароль. Проверьте текущий пароль.')
      console.error('Failed to change password:', error)
    }
  }

  const handleCancel = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    clearError()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Сменить пароль</h2>
                <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    disabled={isLoading}
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Current password */}
            <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Текущий пароль</label>
                <div className="relative">
                    <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full p-3 pr-12 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#00FF26] transition-colors disabled:opacity-50"
                        placeholder="Введите текущий пароль"
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        disabled={isLoading}
                    >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </button>
                </div>
            </div>

            {/* New password */}
            <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Новый пароль</label>
                <div className="relative">
                    <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        className={`w-full p-3 pr-12 bg-gray-900 border rounded-lg text-white placeholder:text-gray-400 focus:outline-none transition-colors disabled:opacity-50 ${
                            newPassword && !isPasswordValid
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-600 focus:border-[#00FF26]'
                        }`}
                        placeholder="Введите новый пароль"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        disabled={isLoading}
                    >
                        {showNewPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </button>
                </div>

                {/* Password requirements */}
                {newPassword && (
                    <div className="mt-2 space-y-1">
                        {passwordErrors.map((error, index) => (
                            <p key={index} className="text-red-400 text-xs">• {error}</p>
                        ))}
                        {passwordErrors.length === 0 && (
                            <p className="text-green-400 text-xs">• Пароль соответствует требованиям</p>
                        )}
                    </div>
                )}
            </div>

            {/* Confirm password */}
            <div className="mb-6">
                <label className="block text-gray-300 text-sm mb-2">Подтвердите пароль</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className={`w-full p-3 pr-12 bg-gray-900 border rounded-lg text-white placeholder:text-gray-400 focus:outline-none transition-colors disabled:opacity-50 ${
                            confirmPassword && confirmPassword !== newPassword
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-600 focus:border-[#00FF26]'
                        }`}
                        placeholder="Повторите новый пароль"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        disabled={isLoading}
                    >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                    <p className="mt-1 text-red-400 text-xs">Пароли не совпадают</p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-gray-800 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                    Отмена
                </button>
                <button
                    onClick={handleSave}
                    disabled={isLoading || !currentPassword || !isPasswordValid || confirmPassword !== newPassword}
                    className="flex-1 relative flex items-center justify-center gap-2 py-3 px-4 bg-black text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                    {/* Зеленые акценты в углах */}
                    <div className="absolute top-0 left-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>

                    <span className="relative z-10">
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                            'Сохранить'
                        )}
                    </span>
                </button>
            </div>
        </div>
    </div>
  )
}