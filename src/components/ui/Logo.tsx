interface LogoProps {
  variant?: 'default' | 'white' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

const textSizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
}

export default function Logo({ variant = 'default', size = 'md', showText = true, className = '' }: LogoProps) {
  const textColor =
    variant === 'white' ? 'text-white' :
    variant === 'dark' ? 'text-gray-900' :
    'text-gray-900'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="PlantSmart AI Logo"
        className={`${sizes[size]} object-contain flex-shrink-0`}
      />
      {showText && (
        <span className={`font-display font-extrabold ${textSizes[size]} ${textColor} tracking-tight leading-none`}>
          PlantSmart <span className="text-green-500">AI</span>
        </span>
      )}
    </div>
  )
}
