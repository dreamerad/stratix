import {ButtonHTMLAttributes, ReactNode} from 'react'
import {clsx} from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    children: ReactNode
}

export function Button({
                           variant = 'primary',
                           size = 'md',
                           isLoading = false,
                           leftIcon,
                           rightIcon,
                           children,
                           className,
                           disabled,
                           ...props
                       }: ButtonProps) {
    const baseClasses = [
        'inline-flex items-center justify-center gap-2 font-semibold rounded-md',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        'transform hover:-translate-y-0.5 active:translate-y-0',
        'relative overflow-hidden'
    ]

    const variants = {
        primary: [
            'bg-accent-green text-primary-bg',
            'hover:bg-accent-green-hover hover:shadow-lg hover:shadow-accent-green/25',
            'focus:ring-accent-green/50',
            'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
            'before:translate-x-[-100%] before:transition-transform before:duration-500',
            'hover:before:translate-x-[100%]'
        ],
        secondary: [
            'bg-transparent text-text-primary border border-border',
            'hover:border-accent-green hover:text-accent-green hover:bg-accent-green/5',
            'focus:ring-accent-green/50'
        ],
        ghost: [
            'bg-transparent text-text-secondary',
            'hover:text-accent-green hover:bg-accent-green/5',
            'focus:ring-accent-green/50'
        ]
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    }

    const isDisabled = disabled || isLoading

    return (
        <button
            type={props.type ?? 'button'}   // гарантируем дефолтный type="button"
            {...props} // теперь все атрибуты в начале
            className={clsx(
                baseClasses,
                variants[variant],
                sizes[size],
                isDisabled && 'hover:transform-none',
                className
            )}
            disabled={isDisabled}
        >

            {/* Loading spinner */}
            {isLoading && (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"/>
            )}

            {/* Left icon */}
            {!isLoading && leftIcon && (
                <span className="animate-scaleIn">{leftIcon}</span>
            )}

            {/* Button text */}
            <span className={clsx(
                'transition-all duration-200',
                isLoading && 'opacity-70'
            )}>
        {children}
      </span>

            {/* Right icon */}
            {!isLoading && rightIcon && (
                <span className="animate-scaleIn">{rightIcon}</span>
            )}
        </button>
    )
}