import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`min-h-[140px] rounded-2xl border bg-white dark:bg-zinc-900 border-neutral-200 dark:border-neutral-800 px-8 py-8 md:px-10 md:py-8 shadow-sm ${className}`}
      style={{ color: 'var(--color-text)' }}
    >
      {children}
    </div>
  )
}
