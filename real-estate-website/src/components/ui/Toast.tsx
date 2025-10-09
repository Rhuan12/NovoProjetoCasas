'use client'

import { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  type: 'success' | 'error'
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
          min-w-[320px] max-w-md
          ${
            type === 'success'
              ? 'bg-success/10 border-success/20 text-success'
              : 'bg-danger/10 border-danger/20 text-danger'
          }
        `}
      >
        {/* Ícone */}
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
        </div>

        {/* Mensagem */}
        <p className="flex-1 text-sm font-medium">
          {message}
        </p>

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}