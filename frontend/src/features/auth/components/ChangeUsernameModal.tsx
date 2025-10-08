import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuthStore } from '@/entities/auth/store/authStore'
import { useToastHelpers } from '@/shared/ui/Toast'

interface ChangeUsernameModalProps {
  isOpen: boolean
  onClose: () => void
  currentUsername: string
}

export function ChangeUsernameModal({ isOpen, onClose, currentUsername }: ChangeUsernameModalProps) {
  const [newUsername, setNewUsername] = useState('')
  const [confirmUsername, setConfirmUsername] = useState('')

  const changeUsername = useAuthStore((state) => state.changeUsername)
  const { isLoading, error, clearError } = useAuthStore()

  const { success, error: showError } = useToastHelpers()

  const handleSave = async () => {
    if (!newUsername.trim()) {
      showError('Поле обязательно', 'Введите новый никнейм')
      return
    }

    if (newUsername.length < 3) {
      showError('Слишком короткий никнейм', 'Никнейм должен содержать минимум 3 символа')
      return
    }

    if (newUsername !== confirmUsername) {
      showError('Никнеймы не совпадают', 'Убедитесь, что никнеймы введены одинаково')
      return
    }

    if (newUsername === currentUsername) {
      showError('Одинаковые никнеймы', 'Новый никнейм должен отличаться от текущего')
      return
    }

    try {
      await changeUsername(newUsername)
      success('Никнейм изменен', 'Новый никнейм успешно установлен')
      handleCancel()
    } catch (error) {
      showError('Ошибка смены никнейма', 'Не удалось изменить никнейм. Возможно, такой никнейм уже занят.')
      console.error('Failed to change username:', error)
    }
  }

  const handleCancel = () => {
    setNewUsername('')
    setConfirmUsername('')
    clearError()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Сменить никнейм</h2>
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

            {/* Current username display */}
            <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Текущий никнейм</label>
                <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400">
                    {currentUsername}
                </div>
            </div>

            {/* New username */}
            <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Новый никнейм</label>
                <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#00FF26] transition-colors disabled:opacity-50"
                    placeholder="Введите новый никнейм"
                    autoComplete="username"
                />
                {newUsername && newUsername.length < 3 && (
                    <p className="mt-1 text-red-400 text-xs">Минимум 3 символа</p>
                )}
            </div>

            {/* Confirm username */}
            <div className="mb-6">
                <label className="block text-gray-300 text-sm mb-2">Подтвердите никнейм</label>
                <input
                    type="text"
                    value={confirmUsername}
                    onChange={(e) => setConfirmUsername(e.target.value)}
                    disabled={isLoading}
                    className={`w-full p-3 bg-gray-900 border rounded-lg text-white placeholder:text-gray-400 focus:outline-none transition-colors disabled:opacity-50 ${
                        confirmUsername && confirmUsername !== newUsername
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-600 focus:border-[#00FF26]'
                    }`}
                    placeholder="Повторите новый никнейм"
                    autoComplete="username"
                />
                {confirmUsername && confirmUsername !== newUsername && (
                    <p className="mt-1 text-red-400 text-xs">Никнеймы не совпадают</p>
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
                    disabled={isLoading || !newUsername || !confirmUsername || newUsername !== confirmUsername || newUsername.length < 3}
                    className="flex-1 relative py-3 px-4 bg-black text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden"
                >
                    {/* Зеленые акценты в углах */}
                    <div className="absolute top-0 left-0 w-6 h-7 bg-[#00FF26] opacity-30 rounded-full blur"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-7 bg-[#00FF26] opacity-30 rounded-full blur"></div>

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