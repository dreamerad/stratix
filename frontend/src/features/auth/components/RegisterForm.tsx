import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button, FormField, LoadingSpinner} from '@/shared/ui'
import {authApi} from '@/shared/api/client'
import {useAuth} from '@/entities/auth/hooks/useAuth'

interface RegisterFormProps {
    onSwitchToLogin: () => void
}

export function RegisterForm({onSwitchToLogin}: RegisterFormProps) {
    const navigate = useNavigate()
    const {login} = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setIsLoading(true)

        const newErrors: Record<string, string> = {}
        if (!formData.username) newErrors.username = 'Username is required'
        if (!formData.password) newErrors.password = 'Password is required'
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        try {
            await authApi.register({
                name: formData.username,
                password: formData.password,
                attributes: []
            })

            await login({username: formData.username, password: formData.password})
            navigate('/dashboard')
        } catch (error: any) {
            if (error.response?.status === 409) {
                setErrors({general: 'Username already exists'})
            } else {
                setErrors({general: 'Registration failed. Please try again.'})
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-primary-card border border-border rounded-2xl p-8 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
                <p className="text-text-muted">Join the mining pool community</p>
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
                    placeholder="Choose a username"
                />

                {/* Password */}
                <FormField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    error={errors.password}
                    placeholder="Create a password"
                    helperText="At least 6 characters"
                />

                {/* Confirm Password */}
                <FormField
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? <LoadingSpinner/> : 'Create Account'}
                </Button>
            </form>

            {/* Switch to Login */}
            <div className="mt-8 text-center">
                <p className="text-text-muted text-sm">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-accent-green hover:text-accent-green-hover font-medium transition-colors"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    )
}