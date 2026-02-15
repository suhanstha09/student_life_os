type BadgeProps = {
  label: string
  tone?: 'neutral' | 'amber' | 'emerald' | 'blue' | 'rose'
}

const toneStyles: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'border-neutral-200 bg-neutral-100 text-neutral-600',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
}

export default function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${toneStyles[tone]}`}
    >
      {label}
    </span>
  )
}
