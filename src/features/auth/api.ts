import { sha256Hex } from '../../shared/lib/crypto'
import type { Account, AuthSession } from './types'

const ACCOUNTS_KEY = 'pokedex.accounts.v1'

function normalizeUsername(value: string): string {
  return value.trim().toLowerCase()
}

function readAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is Account => {
      if (typeof x !== 'object' || x === null) return false
      const obj = x as Record<string, unknown>
      return (
        typeof obj.username === 'string' &&
        typeof obj.passwordHashHex === 'string' &&
        typeof obj.createdAtIso === 'string'
      )
    })
  } catch {
    return []
  }
}

function writeAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export type RegisterResult =
  | { ok: true; session: AuthSession }
  | { ok: false; message: string }

export async function register(params: {
  username: string
  password: string
}): Promise<RegisterResult> {
  const username = normalizeUsername(params.username)
  const password = params.password

  if (username.length < 3) {
    return { ok: false, message: 'Username must be at least 3 characters.' }
  }
  if (!/^[a-z0-9._-]+$/.test(username)) {
    return {
      ok: false,
      message: 'Username can contain letters, numbers, dot, underscore and dash.',
    }
  }
  if (password.length < 6) {
    return { ok: false, message: 'Password must be at least 6 characters.' }
  }

  const accounts = readAccounts()
  if (accounts.some((a) => a.username === username)) {
    return { ok: false, message: 'Username already exists.' }
  }

  const passwordHashHex = await sha256Hex(password)
  const createdAtIso = new Date().toISOString()
  writeAccounts([...accounts, { username, passwordHashHex, createdAtIso }])

  return {
    ok: true,
    session: { username, loggedInAtIso: new Date().toISOString() },
  }
}

export type LoginResult =
  | { ok: true; session: AuthSession }
  | { ok: false; message: string }

export async function login(params: {
  username: string
  password: string
}): Promise<LoginResult> {
  const username = normalizeUsername(params.username)
  const password = params.password

  const accounts = readAccounts()
  const account = accounts.find((a) => a.username === username)
  if (!account) return { ok: false, message: 'Invalid username or password.' }

  const passwordHashHex = await sha256Hex(password)
  if (passwordHashHex !== account.passwordHashHex) {
    return { ok: false, message: 'Invalid username or password.' }
  }

  return {
    ok: true,
    session: { username, loggedInAtIso: new Date().toISOString() },
  }
}

