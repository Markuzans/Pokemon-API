import type { ReactNode } from 'react'

export default function Alert({
  title = 'Error',
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
      <div className="mb-1 text-sm font-semibold">{title}</div>
      <div className="text-sm">{children}</div>
    </div>
  )
}

