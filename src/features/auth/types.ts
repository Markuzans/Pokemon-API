export type Account = {
  username: string
  passwordHashHex: string
  createdAtIso: string
}

export type AuthSession = {
  username: string
  loggedInAtIso: string
}

