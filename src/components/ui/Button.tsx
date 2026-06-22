import { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-green-500 text-white hover:bg-green-600 shadow-green hover:shadow-green-lg hover:-translate-y-0.5 active:translate-y-0',
  outline: 'bg-transparent text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white hover:-translate-y-0.5',
  ghost: 'bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-sm',
  white: 'bg-white text-green-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({ variant = 'primary', size = 'md', children, fullWidth, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-full font-semibold
        transition-all duration-250 cursor-pointer font-sans leading-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
