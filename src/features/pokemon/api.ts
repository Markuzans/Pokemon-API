import { createHttpClient, toApiError, type ApiError } from '../../shared/api/http'
import type { Pokemon, PokemonSpecies } from './types'

const pokeApi = createHttpClient('https://pokeapi.co/api/v2')

export async function getPokemon(
  nameOrId: string | number,
): Promise<{ data: Pokemon } | { error: ApiError }> {
  try {
    const data = await pokeApi
      .get<Pokemon>(`/pokemon/${String(nameOrId).toLowerCase()}`)
      .then((r) => r.data)
    return { data }
  } catch (e) {
    return { error: toApiError(e, 'Failed to load Pokémon details') }
  }
}

export async function getPokemonSpecies(
  nameOrId: string | number,
): Promise<{ data: PokemonSpecies } | { error: ApiError }> {
  try {
    const data = await pokeApi
      .get<PokemonSpecies>(`/pokemon-species/${String(nameOrId).toLowerCase()}`)
      .then((r) => r.data)
    return { data }
  } catch (e) {
    return { error: toApiError(e, 'Failed to load Pokémon species') }
  }
}

