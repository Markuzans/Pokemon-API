import { useEffect, useMemo, useState } from 'react'
import type { ApiError } from '../../shared/api/http'
import Alert from '../../shared/ui/Alert'
import Modal from '../../shared/ui/Modal'
import Spinner from '../../shared/ui/Spinner'
import { capitalize } from '../../shared/lib/text'
import { MAX_POKEMON_ID } from '../../shared/lib/poke'
import { getPokemon, getPokemonSpecies } from './api'
import type { Pokemon, PokemonSpecies } from './types'

function firstEnglishFlavorText(species: PokemonSpecies): string | null {
  const entry = species.flavor_text_entries.find((e) => e.language.name === 'en')
  if (!entry) return null
  return entry.flavor_text.replace(/\s+/g, ' ').trim()
}

export default function PokemonDetailsModal({
  nameOrId,
  isOpen,
  onClose,
}: {
  nameOrId: string | number | null
  isOpen: boolean
  onClose: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [species, setSpecies] = useState<PokemonSpecies | null>(null)

  useEffect(() => {
    if (!isOpen || nameOrId === null) return
    let isActive = true

    setIsLoading(true)
    setError(null)
    setPokemon(null)
    setSpecies(null)

    const raw = String(nameOrId).trim().toLowerCase()
    const maybeId = typeof nameOrId === 'number' ? nameOrId : Number(raw)
    if (Number.isInteger(maybeId) && maybeId > MAX_POKEMON_ID) {
      setError({
        kind: 'api_error',
        message: `Pokémon IDs above ${MAX_POKEMON_ID} are not supported in this app.`,
      })
      setIsLoading(false)
      return () => {
        isActive = false
      }
    }

    Promise.all([getPokemon(nameOrId), getPokemonSpecies(nameOrId)])
      .then(([p, s]) => {
        if (!isActive) return
        if ('error' in p) {
          setError(p.error)
          return
        }
        if ('error' in s) {
          setError(s.error)
          return
        }
        if (p.data.id > MAX_POKEMON_ID) {
          setError({
            kind: 'api_error',
            message: `Pokémon #${p.data.id} is beyond the supported range (1-${MAX_POKEMON_ID}).`,
          })
          return
        }
        setPokemon(p.data)
        setSpecies(s.data)
      })
      .finally(() => {
        if (!isActive) return
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [isOpen, nameOrId])

  const title = useMemo(() => {
    if (!pokemon) return 'Pokémon details'
    return `${capitalize(pokemon.name)} #${pokemon.id}`
  }, [pokemon])

  const artwork =
    pokemon?.sprites.other?.['official-artwork']?.front_default ??
    pokemon?.sprites.front_default

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      {error ? <Alert>{error.message}</Alert> : null}

      {isLoading ? (
        <Spinner label="Loading details..." />
      ) : pokemon ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[160px_1fr]">
          <div className="flex items-center justify-center rounded-2xl bg-slate-50 p-3">
            {artwork ? (
              <img
                src={artwork}
                alt={pokemon.name}
                className="h-36 w-36 object-contain"
                loading="lazy"
              />
            ) : (
              <div className="text-sm text-slate-500">No image</div>
            )}
          </div>

          <div className="min-w-0">
            {species ? (
              <p className="text-sm text-slate-700">
                {firstEnglishFlavorText(species) ?? 'No flavor text found.'}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              {pokemon.types
                .slice()
                .sort((a, b) => a.slot - b.slot)
                .map((t) => (
                  <span
                    key={t.type.name}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                  >
                    {capitalize(t.type.name)}
                  </span>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500">Height</div>
                <div className="text-sm font-semibold text-slate-900">
                  {pokemon.height / 10} m
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500">Weight</div>
                <div className="text-sm font-semibold text-slate-900">
                  {pokemon.weight / 10} kg
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-900">Base stats</div>
              <div className="mt-2 space-y-2">
                {pokemon.stats.map((s) => (
                  <div key={s.stat.name} className="flex items-center gap-3">
                    <div className="w-28 shrink-0 text-xs font-medium text-slate-600">
                      {capitalize(s.stat.name.replace('-', ' '))}
                    </div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${Math.min(100, (s.base_stat / 200) * 100)}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs font-semibold text-slate-800">
                      {s.base_stat}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-600">Select a Pokémon.</div>
      )}
    </Modal>
  )
}

