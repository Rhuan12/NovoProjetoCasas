// src/components/ui/Button.tsx - VERSÃO CORRIGIDA COM FORWARDREF

import React, { forwardRef } from 'react'
import { clsx } from 'clsx'

// ============================================
// BUTTON COMPONENT
// ============================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
  className?: string
}

// ✅ CORREÇÃO: Usar forwardRef para aceitar ref
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled,
    className,
    children,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-accent-primary text-white hover:bg-accent-hover',
      secondary: 'bg-background-secondary text-text-primary hover:bg-background-tertiary',
      outline: 'border border-text-muted text-text-primary hover:bg-background-secondary',
      ghost: 'text-text-primary hover:bg-background-secondary'
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    return (
      <button
        ref={ref} // ✅ Passar ref para o button
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

// ✅ IMPORTANTE: Adicionar displayName para React DevTools
Button.displayName = 'Button'

// ============================================
// INPUT COMPONENT
// ============================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helper, 
    className,
    id,
    ...props 
  }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-text-muted">{helper}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// ============================================
// CARD COMPONENT
// ============================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = false, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={clsx(
          'bg-background-secondary rounded-xl border border-background-tertiary',
          hover && 'transition-all duration-200 hover:bg-background-tertiary hover:scale-[1.02]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// ============================================
// BADGE COMPONENT
// ============================================

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'sold'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', className }, ref) => {
    const variants = {
      default: 'bg-background-tertiary text-text-primary',
      success: 'bg-success/20 text-success',
      warning: 'bg-warning/20 text-warning',
      danger: 'bg-danger/20 text-danger',
      sold: 'bg-sold/20 text-sold'
    }
    
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1 text-sm'
    }

    return (
      <span 
        ref={ref}
        className={clsx(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'