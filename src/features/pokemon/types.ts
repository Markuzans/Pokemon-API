export type NamedApiResource = {
  name: string
  url: string
}

export type PokemonTypeSlot = {
  slot: number
  type: NamedApiResource
}

export type PokemonStat = {
  base_stat: number
  effort: number
  stat: NamedApiResource
}

export type PokemonAbilitySlot = {
  is_hidden: boolean
  slot: number
  ability: NamedApiResource
}

export type PokemonSprites = {
  front_default: string | null
  front_shiny: string | null
  other?: {
    'official-artwork'?: { front_default: string | null }
  }
}

export type Pokemon = {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  abilities: PokemonAbilitySlot[]
  types: PokemonTypeSlot[]
  stats: PokemonStat[]
  sprites: PokemonSprites
}

export type PokemonSpeciesFlavorTextEntry = {
  flavor_text: string
  language: NamedApiResource
  version: NamedApiResource
}

export type PokemonSpecies = {
  id: number
  name: string
  flavor_text_entries: PokemonSpeciesFlavorTextEntry[]
}

