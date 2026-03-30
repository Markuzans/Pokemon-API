import { capitalize } from '../../shared/lib/text'
import { pokemonSpriteUrl } from '../../shared/lib/poke'

export default function PokemonCard({
  id,
  name,
  onClick,
}: {
  id: number
  name: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm',
        'transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
      ].join(' ')}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50">
          <img
            src={pokemonSpriteUrl(id)}
            alt={name}
            className="h-12 w-12 image-rendering-pixelated"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate text-base font-semibold text-slate-900">
              {capitalize(name)}
            </div>
            <div className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              #{String(id).padStart(4, '0')}
            </div>
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Tap to view details
          </div>
        </div>
      </div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 transition group-hover:opacity-100" />
    </button>
  )
}

