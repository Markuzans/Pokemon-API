import { createHttpClient, toApiError, type ApiError } from '../../shared/api/http'
import type { PokemonListResponse } from './types'

const pokeApi = createHttpClient('https://pokeapi.co/api/v2')

export async function getPokemonPage(params: {
  limit: number
  offset: number
}): Promise<{ data: PokemonListResponse } | { error: ApiError }> {
  try {
    const data = await pokeApi
      .get<PokemonListResponse>('/pokemon', { params })
      .then((r) => r.data)
    return { data }
  } catch (e) {
    return { error: toApiError(e, 'Failed to load Pokémon list') }
  }
}

