import { type InputHTMLAttributes, forwardRef } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', label, hint, error, id, ...props },
  ref,
) {
  const inputId = id ?? props.name

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          {label}
        </label>
      ) : null}

      <input
        {...props}
        id={inputId}
        ref={ref}
        className={[
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
          'border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200',
          error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : '',
          className,
        ].join(' ')}
      />

      {error ? (
        <p className="mt-1 text-sm text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-sm text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
})

export default Input

