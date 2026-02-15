import type { ReactNode } from 'react'

type SectionHeaderProps = {
  title: string
  children?: ReactNode
}

export default function SectionHeader({ title, children }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-neutral-800">{title}</h3>
      {children}
    </div>
  )
}
