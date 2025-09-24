import { useState } from 'react'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export function AuthPage() {
  const [isRegister, setIsRegister] = useState(false)

  return (

    <div className="min-h-screen bg-gradient-to-br from-primary-bg to-primary-bg-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Анимированные элементы фона */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent-green/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-accent-green/5 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent-green/10 rounded-full animate-ping"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {isRegister ? (
          <RegisterForm onSwitchToLogin={() => setIsRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setIsRegister(true)} />
        )}
      </div>
    </div>
  )
}