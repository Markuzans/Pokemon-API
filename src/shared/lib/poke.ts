export const MAX_POKEMON_ID = 1025

export function pokemonIdFromUrl(url: string): number | null {
  // Example: https://pokeapi.co/api/v2/pokemon/25/
  const match = url.match(/\/pokemon\/(\d+)\/?$/)
  if (!match) return null
  const id = Number(match[1])
  return Number.isFinite(id) ? id : null
}

export function pokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

