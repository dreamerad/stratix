import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button, FormField, LoadingSpinner} from '@/shared/ui'
import {useAuth} from '@/entities/auth/hooks/useAuth'

interface LoginFormProps {
    onSwitchToRegister: () => void
}

export function LoginForm({onSwitchToRegister}: LoginFormProps) {
    const navigate = useNavigate()
    const {login, isLoading} = useAuth()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        const newErrors: Record<string, string> = {}
        if (!formData.username) newErrors.username = 'Username is required'
        if (!formData.password) newErrors.password = 'Password is required'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            await login({username: formData.username, password: formData.password})
            navigate('/dashboard')
        } catch (error) {
            setErrors({general: 'Invalid username or password'})
        }
    }

    return (
        <div className="bg-primary-card border border-border rounded-2xl p-8 shadow-xl">
            {/* Header */}
            {/* Logo */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-32 h-16 bg-accent-green/10 rounded-2xl mb-4">
                    <span className="text-accent-green text-2xl font-bold">Stratix</span>
                </div>
            </div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome</h1>
                <p className="text-text-muted">Sign in to your mining pool account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {errors.general && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400 text-sm">{errors.general}</p>
                    </div>
                )}

                {/* Username */}
                <FormField
                    label="Username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    error={errors.username}
                    placeholder="Enter your username"
                />

                {/* Password */}
                <FormField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    error={errors.password}
                    placeholder="Enter your password"
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? <LoadingSpinner/> : 'Sign In'}
                </Button>
            </form>

            {/* Switch to Register */}
            <div className="mt-8 text-center">
                <p className="text-text-muted text-sm">
                    Don't have an account?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-accent-green hover:text-accent-green-hover font-medium transition-colors"
                    >
                        Create Account
                    </button>
                </p>
            </div>
        </div>
    )
}