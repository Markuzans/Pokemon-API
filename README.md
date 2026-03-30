# PokeDex SPA (React + TypeScript + Axios + Tailwind)

Single Page Application, kas integrējas ar [PokeAPI](https://pokeapi.co/docs/v2) (GET) un demonstrē arī Axios POST (publisks “echo” endpoints).

## Palaišana

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Feature-based struktūra

- `src/features/catalog/`
  - `api.ts` – PokeAPI GET sarakstam (`/pokemon?limit&offset`)
  - `types.ts` – tipētas atbildes
  - `PokemonCatalog.tsx`, `PokemonCard.tsx`, `Pagination.tsx`
- `src/features/pokemon/`
  - `api.ts` – PokeAPI GET detaļām (`/pokemon/{id|name}`, `/pokemon-species/{id|name}`)
  - `types.ts` – tipēti datu modeļi
  - `PokemonDetailsModal.tsx`
- `src/features/feedback/`
  - `api.ts` – Axios POST uz `https://httpbin.org/post`
  - `types.ts` – payload/response tipi
  - `FeedbackForm.tsx`
- `src/features/auth/`
  - `api.ts` – lokāla reģistrācija/login (localStorage + SHA-256)
  - `types.ts` – Account/Session tipi
  - `AuthPage.tsx` – login/registration UI
- `src/shared/`
  - `api/http.ts` – kopīgs Axios klients + tipēta kļūdu normalizācija
  - `ui/*` – UI komponentes (Button/Input/Modal/Spinner/Alert)
  - `lib/*` – mazas util funkcijas

## UI/UX

- Responsīvs izkārtojums (Tailwind)
- Loading un Error stāvokļi gan GET, gan POST
- Detaļu modālis ar Escape aizvēršanu
- Login/Register ekrāns, un Feedback pieejams tikai ielogotiem lietotājiem

## Git prasība (main/master)

Šajā datorā `git` komanda nav pieejama (nav uzinstalēts Git), tāpēc repo nevar automātiski inicializēt no šejienes.

Lai viss kods būtu `main` zarā:

```bash
git init -b main
git add .
git commit -m "Initial PokeDex SPA"
```

