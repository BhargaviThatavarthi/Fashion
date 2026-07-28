import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        pink: 'text-white hover:-translate-y-0.5',
        gold: 'text-white hover:-translate-y-0.5',
        whatsapp: 'text-white hover:-translate-y-0.5',
        'outline-pink': 'border-2 hover:-translate-y-0.5',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const extraStyle: React.CSSProperties = {}
    if (variant === 'pink') {
      Object.assign(extraStyle, {
        background: 'linear-gradient(135deg, var(--color-pink) 0%, var(--color-pink-dark) 100%)',
        boxShadow: '0 4px 20px rgba(216,92,138,0.3)',
      })
    } else if (variant === 'gold') {
      Object.assign(extraStyle, {
        background: 'linear-gradient(135deg, var(--color-gold) 0%, #a8863d 100%)',
        boxShadow: '0 4px 20px rgba(200,164,93,0.3)',
      })
    } else if (variant === 'whatsapp') {
      Object.assign(extraStyle, {
        background: 'linear-gradient(135deg, var(--color-whatsapp) 0%, var(--color-whatsapp-dark) 100%)',
        boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
      })
    } else if (variant === 'outline-pink') {
      Object.assign(extraStyle, {
        borderColor: 'var(--color-pink)',
        color: 'var(--color-pink)',
      })
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        style={extraStyle}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
