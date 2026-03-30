import { useMemo, useState } from 'react'
import Alert from '../../shared/ui/Alert'
import Button from '../../shared/ui/Button'
import Input from '../../shared/ui/Input'
import Spinner from '../../shared/ui/Spinner'
import { login, register } from './api'

type Mode = 'login' | 'register'

export default function AuthPage({
  onAuthed,
  currentUsername,
  onLogout,
}: {
  onAuthed: (username: string) => void
  currentUsername?: string | null
  onLogout?: () => void
}) {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (currentUsername) {
    return (
      <div className="mx-auto w-full max-w-md px-4 pb-12 pt-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xl font-semibold text-slate-900">Account</div>
          <div className="mt-1 text-sm text-slate-600">
            Signed in as <span className="font-semibold">@{currentUsername}</span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button
              variant="danger"
              onClick={() => {
                onLogout?.()
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const title = useMemo(() => {
    return mode === 'login' ? 'Sign in' : 'Create account'
  }, [mode])

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-12 pt-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-600">
          Accounts are stored locally in your browser for this demo.
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-1">
          <button
            className={[
              'rounded-xl px-3 py-2 text-sm font-semibold transition',
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
            onClick={() => {
              setMode('login')
              setErrorMessage(null)
            }}
            type="button"
          >
            Sign in
          </button>
          <button
            className={[
              'rounded-xl px-3 py-2 text-sm font-semibold transition',
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            ].join(' ')}
            onClick={() => {
              setMode('register')
              setErrorMessage(null)
            }}
            type="button"
          >
            Register
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setErrorMessage(null)

            if (!username.trim() || !password) return
            if (mode === 'register' && password !== confirmPassword) {
              setErrorMessage('Passwords do not match.')
              return
            }

            setIsLoading(true)
            try {
              const result =
                mode === 'login'
                  ? await login({ username, password })
                  : await register({ username, password })

              if (!result.ok) {
                setErrorMessage(result.message)
                return
              }

              onAuthed(result.session.username)
            } finally {
              setIsLoading(false)
            }
          }}
        >
          <Input
            label="Username"
            placeholder="e.g. misty"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            hint="Use letters/numbers and . _ - (min 3 chars)."
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hint="Min 6 characters."
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'register' ? (
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={
                isLoading ||
                username.trim().length === 0 ||
                password.length === 0 ||
                (mode === 'register' && confirmPassword.length === 0)
              }
            >
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
            {isLoading ? <Spinner label="Working..." /> : null}
          </div>

          {errorMessage ? <Alert title="Auth error">{errorMessage}</Alert> : null}
        </form>
      </div>
    </div>
  )
}

