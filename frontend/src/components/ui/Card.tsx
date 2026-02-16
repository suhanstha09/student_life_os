import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`min-h-[140px] rounded-2xl border px-7 py-6 shadow-sm ${className}`}
      style={{
        background: 'var(--color-card)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
      }}
    >
      {children}
    </div>
  )
}
