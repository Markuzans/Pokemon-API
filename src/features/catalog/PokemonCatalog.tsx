import { useEffect, useMemo, useState } from 'react'
import { getPokemonPage } from './api'
import type { ApiError } from '../../shared/api/http'
import Alert from '../../shared/ui/Alert'
import Input from '../../shared/ui/Input'
import Spinner from '../../shared/ui/Spinner'
import Pagination from './Pagination'
import PokemonCard from './PokemonCard'
import { MAX_POKEMON_ID, pokemonIdFromUrl } from '../../shared/lib/poke'
import PokemonDetailsModal from '../pokemon/PokemonDetailsModal'

type ViewModel = {
  id: number
  name: string
}

export default function PokemonCatalog({ isAuthed }: { isAuthed: boolean }) {
  const [page, setPage] = useState(1)
  const pageSize = 24

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | number | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<ViewModel[]>([])

  const offset = (page - 1) * pageSize

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    setError(null)

    getPokemonPage({ limit: pageSize, offset })
      .then((result) => {
        if (!isActive) return
        if ('error' in result) {
          setError(result.error)
          setItems([])
          setCount(0)
          return
        }

        const mapped: ViewModel[] = result.data.results
          .map((r) => {
            const id = pokemonIdFromUrl(r.url)
            if (!id) return null
            if (id > MAX_POKEMON_ID) return null
            return { id, name: r.name }
          })
          .filter((x): x is ViewModel => x !== null)

        setItems(mapped)
        setCount(Math.min(result.data.count, MAX_POKEMON_ID))
      })
      .finally(() => {
        if (!isActive) return
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [offset])

  const headerHint = useMemo(() => {
    if (!isAuthed) return 'Login to unlock the feedback POST form.'
    return 'You are logged in. Enjoy extra features.'
  }, [isAuthed])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-slate-900">
            Pokédex
          </div>
          <div className="mt-1 text-sm text-slate-600">{headerHint}</div>
        </div>

        <form
          className="flex w-full gap-2 sm:w-[420px]"
          onSubmit={(e) => {
            e.preventDefault()
            const value = query.trim().toLowerCase()
            if (!value) return
            const maybeId = Number(value)
            if (Number.isInteger(maybeId) && maybeId > MAX_POKEMON_ID) {
              setError({
                kind: 'api_error',
                message: `Pokémon IDs above ${MAX_POKEMON_ID} are not supported in this app.`,
              })
              return
            }
            setSelected(value)
          }}
        >
          <Input
            label="Search"
            placeholder={`Name or ID (1-${MAX_POKEMON_ID}) (e.g. pikachu, 25)`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="mt-6 h-10 shrink-0 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            Go
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={count}
          onPageChange={(next) => setPage(next)}
        />
      </div>

      <div className="mt-6">
        {error ? (
          <Alert>
            {error.message}
            {error.status ? (
              <span className="ml-2 text-rose-700/80">(HTTP {error.status})</span>
            ) : null}
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="mt-6">
            <Spinner label="Loading Pokémon..." />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PokemonCard
                key={p.id}
                id={p.id}
                name={p.name}
                onClick={() => setSelected(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      <PokemonDetailsModal
        nameOrId={selected}
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

