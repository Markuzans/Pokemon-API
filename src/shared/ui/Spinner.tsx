export default function Spinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-700">
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600"
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}

