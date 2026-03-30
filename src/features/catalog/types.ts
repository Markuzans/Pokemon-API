export type NamedApiResource = {
  name: string
  url: string
}

export type PokemonListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

