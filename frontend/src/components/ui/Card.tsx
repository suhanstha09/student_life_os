import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white px-4 py-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}
