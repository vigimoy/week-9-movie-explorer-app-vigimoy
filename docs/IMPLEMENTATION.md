# Movie Explorer — implementation guide

## Run locally

Use Node.js 22.12+ (validated with Node.js 24). Run `npm ci`, then copy `.env.example` to `.env`. Set `VITE_TMDB_API_KEY` to your TMDB v3 API key and run `npm run dev`.

On this Windows machine, npm's cache can stay on drive D:

```powershell
npm ci --cache D:\codex-cache\npm
Copy-Item .env.example .env
npm run dev
```

A key is not included. Without credentials the app displays setup instructions. It never silently substitutes example films for live API data. Restart Vite after changing environment variables.

Alternatively set `VITE_TMDB_ACCESS_TOKEN` to a TMDB **API Read Access Token**. It is sent as a Bearer token and takes precedence over the v3 key. A v3 API key is sent as the `api_key` query parameter. These are different credentials.

Vite exposes `VITE_*` values to the browser. Only use TMDB application credentials here, never a TMDB account password or unrelated server secrets. The local `.env` is excluded from Git.

## Routes and behavior

| Route             | Behavior                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `/`               | Featured popular movie, horizontal popular-film carousel labeled Trending Now, paginated now-playing releases |
| `/movie/:id`      | Poster, backdrop, date, runtime, rating, genres, regional certification, trailer, cast/crew, similar movies   |
| `/favorites`      | Locally saved movies, remove controls, trailer access, empty state                                            |
| `/search?q=title` | Validated title search, shareable URL, result rows, pagination, empty state                                   |
| Anything else     | Recoverable not-found screen                                                                                  |

Home initially shows 15 releases on desktop and 8 on mobile, matching the reference's grid counts. Load More reveals already fetched results before requesting another API page. Genre and sorting operate on loaded releases; the filter panel explains this scope. Popular film content and hero selection come from TMDB, so titles/posters will change.

Favorites serve as the assignment's saved-movie list. They are stored under `movie-favorites` in localStorage using Zustand persist. Saved data is validated before hydration; corrupt storage falls back to an empty list. When browser storage is unavailable, the in-memory list remains usable.

Trailer lookup is lazy. Opening a trailer uses the cached details query or fetches it; closing the Radix dialog unmounts the player. Only valid YouTube trailer IDs are embedded. A missing trailer displays an empty state, or a disabled button when details are already known.

Age labels use Indonesia's certification first, then the US certification, then “Not rated”; the design's example “13” is not assumed for every film.

## Data flow and learning map

1. `src/lib/axios.ts`: authentication, cancellation support, timeouts, friendly HTTP errors.
2. `src/services/movieService.ts`: typed TMDB endpoint calls.
3. `src/hooks/useMovies.ts`: React Query keys, pagination, enabled queries.
4. `src/main.tsx`: five-minute freshness, thirty-minute garbage collection, bounded retries.
5. `src/store/movieStore.ts`: favorites and validated browser persistence.
6. `src/components/SearchForm.tsx`: React Hook Form and Zod schema, URL navigation.
7. `src/components/ui/`: shadcn-style Button (Radix Slot + CVA), Input, Skeleton.
8. `src/components/layout/Layout.tsx`: navigation, responsive search, Radix mobile menu, toast lifecycle.
9. `src/components/TrailerDialog.tsx`: accessible Radix Dialog and trailer behavior.
10. `src/pages/`: route composition; lazy-loaded through React Router.
11. `src/index.css`: Tailwind v4 theme, Figma tokens, component layouts, responsive rules.
12. `src/components/Page.tsx`: Framer Motion page entry. Reduced motion preferences are respected.

All TMDB calls go through React Query. Detail requests append credits, videos, similar movies, and release dates to avoid separate requests for every section. Query functions pass AbortSignal to Axios; input changes cancel obsolete searches.

The shared UI stays separate from page data. TypeScript strict mode is enabled. Fonts are bundled locally. Movie and person images are dynamic, lazy loaded where appropriate, and have a missing-image fallback. Vendor chunks are separated from route code.

Read these files in the sequence above to understand the implementation. The assignment's original guidance remains in README.md.

## Commands

- `npm run dev`: local development; React Query Devtools appear in development only.
- `npm run build`: TypeScript checks and production build.
- `npm run preview`: inspect the production build.
- `npm run lint`: ESLint checks.
- `npm test`: unit tests for TMDB data edge cases.
- `npm run test:e2e`: Playwright desktop/mobile browser workflows.
- `npm run format` / `npm run format:check`: formatting.

Set `VITE_SHOW_DEVTOOLS=false` to hide the development-only debugging button.

The E2E configuration uses installed Google Chrome; no browser download is needed on this machine. It starts isolated Vite servers on ports 4173 and 4174. API and video requests are intercepted by Playwright; test credentials are placeholders and are never sent to TMDB. Film fixture images are reduced-size exports from the provided Figma and are only served by the test router. They are not shipped in the production site.

To keep browser temporary files on D:

```powershell
$env:TEMP = 'D:\codex-cache\tmp'
$env:TMP = 'D:\codex-cache\tmp'
npm run test:e2e
```

## Still needs a real API key

Live TMDB authentication, current catalogue data, real trailer playback, and an end-to-end production connection cannot be verified without credentials. Browser tests cover the user flows using deterministic TMDB-shaped responses. Firefox/Safari and deployed hosting have not been tested. Deployment/push are not part of the local commits.

## References

- [Provided Figma](https://www.figma.com/design/UBm7Fz1KTZiKJqw0jmo08i/Front-End-Developer-Test---Movie-Explorer-App--Copy-?node-id=8411-143671)
- [TMDB application authentication](https://developer.themoviedb.org/docs/authentication-application)
- [TMDB movie details and append_to_response](https://developer.themoviedb.org/reference/movie-details)
- [shadcn Button](https://ui.shadcn.com/docs/components/radix/button)
- [Vite build options](https://vite.dev/config/build-options)
