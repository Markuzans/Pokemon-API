import { useEffect, useMemo, useState } from 'react'
import PokemonCatalog from './features/catalog/PokemonCatalog'
import FeedbackForm from './features/feedback/FeedbackForm'
import AuthPage from './features/auth/AuthPage'

type View = 'catalog' | 'feedback' | 'auth'

type Session = {
  user: { username: string } | null
}

const SESSION_KEY = 'pokedex.session.v1'

function loadSession(): Session {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return { user: null }
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'user' in parsed
    ) {
      const user = (parsed as { user: unknown }).user
      if (
        user === null ||
        (typeof user === 'object' &&
          user !== null &&
          'username' in user &&
          typeof (user as { username: unknown }).username === 'string')
      ) {
        return parsed as Session
      }
    }
    return { user: null }
  } catch {
    return { user: null }
  }
}

export default function App() {
  const [view, setView] = useState<View>('catalog')
  const [session, setSession] = useState<Session>(() => loadSession())

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }, [session])

  const canAccessFeedback = session.user !== null

  const nav = useMemo(() => {
    const base =
      'rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
    const active = 'bg-slate-900 text-white'
    const inactive = 'text-slate-700 hover:bg-slate-100'

    return {
      catalog: [base, view === 'catalog' ? active : inactive].join(' '),
      feedback: [base, view === 'feedback' ? active : inactive].join(' '),
      auth: [base, view === 'auth' ? active : inactive].join(' '),
    }
  }, [view])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                PokeDex SPA
              </div>
              <div className="text-xs text-slate-500">
                React + TypeScript + Axios + Tailwind + PokeAPI
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <button className={nav.catalog} onClick={() => setView('catalog')}>
              Catalog
            </button>
            <button
              className={nav.feedback}
              onClick={() => (canAccessFeedback ? setView('feedback') : setView('auth'))}
            >
              Feedback (POST)
            </button>
            <button
              className={nav.auth}
              onClick={() => setView('auth')}
              type="button"
            >
              {session.user ? `@${session.user.username}` : 'Login'}
            </button>
          </nav>
        </div>
      </header>

      <main>
        {view === 'catalog' ? <PokemonCatalog isAuthed={canAccessFeedback} /> : null}

        {view === 'feedback' ? (
          canAccessFeedback && session.user ? (
            <FeedbackForm trainerName={session.user.username} />
          ) : (
            <AuthPage
              onAuthed={(username) => {
                setSession({ user: { username } })
                setView('feedback')
              }}
              currentUsername={session.user?.username ?? null}
              onLogout={() => {
                setSession({ user: null })
                setView('catalog')
              }}
            />
          )
        ) : null}

        {view === 'auth' ? (
          <AuthPage
            onAuthed={(username) => {
              setSession({ user: { username } })
              setView('catalog')
            }}
            currentUsername={session.user?.username ?? null}
            onLogout={() => {
              setSession({ user: null })
              setView('catalog')
            }}
          />
        ) : null}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
          Data provided by PokeAPI. This app demonstrates feature-based architecture,
          typed API integration, and robust loading/error states.
        </div>
      </footer>
    </div>
  )
}

