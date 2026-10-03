# Verification — 29 September 2026

## Completed checks

| Check                        | Result                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run build`              | Pass: strict TypeScript and production bundling; no oversized-chunk warning                  |
| `npm run lint`               | Pass                                                                                         |
| `npm run format:check`       | Pass                                                                                         |
| `npm test`                   | 5 unit tests pass                                                                            |
| Core Playwright suite        | 15 browser cases pass; the mobile-only menu test is intentionally skipped on desktop         |
| Additional responsive matrix | 1 case passes at 320, 768, and 1024px; duplicate mobile-project run is intentionally skipped |
| Production preview smoke     | Setup, favorites, and 404 routes render without JavaScript exceptions                        |
| Static Figma assets          | All 15 files are nonempty; rendered detail assets load at narrow/tablet widths               |
| Git diff whitespace          | Pass                                                                                         |

The combined E2E configuration contains 18 project/test combinations: 16 applicable cases and two intentional skips. Desktop uses Chrome at 1440×1024; mobile uses Chromium emulation at 393×852. Mobile emulation does not constitute a Safari/iPhone-device test.

## Browser behaviors exercised

- Featured movie, popular carousel content, now-playing releases.
- Load More across cached items and another API page.
- Genre filtering and title sorting.
- Detail metadata, cast, crew, and similar films.
- Trailer dialog, iframe URL, and Escape dismissal.
- Favorite addition, toast, reload persistence, removal, and empty state.
- Empty/whitespace search validation, successful search, no results, clear action.
- HTTP 401 error and retry recovery.
- Loading skeletons, null poster, unavailable trailer, missing certification.
- Malformed browser storage, invalid movie ID, and unknown route.
- Setup screen without credentials and zero outgoing TMDB API requests in that state.
- Mobile menu, focus restoration, close action, and navigation.
- No horizontal page overflow at desktop, mobile, narrow, and tablet widths.

Unit tests cover image URL fallback, date/runtime formatting, safe official YouTube trailer selection, certification fallback, and deduplication of overlapping pages.

## Visual review

Home, detail, favorites, empty favorites, and search screenshots were compared with the Figma design. Poppins, colors, margins, icon assets, poster ratios, responsive grid, and mobile navigation follow the reference. Additional crew, runtime, recommendations, filters, and status messages satisfy the assignment requirements.

Playwright screenshots are written to ignored `test-results/` folders. Visual test data and imagery reproduce the reference films for stable inspection; they are never runtime substitutes for the TMDB catalogue.

## Live TMDB verification — 3 October 2026

A local API Read Access Token was configured in `.env`, which is ignored by Git. An additional Chrome browser session used real requests without interception and verified:

- HTTP 200 responses for popular movies, genres, now-playing movies, movie details, and search.
- Home content, loaded posters, movie detail navigation, and search results.
- Adding a favorite, persistence after reload, removal, and the empty state.
- Load More revealing cached results and then fetching now-playing page 2 with HTTP 200.
- The trailer dialog opening a YouTube embed URL supplied by TMDB and closing with Escape.
- No JavaScript exceptions during the main flow and no horizontal overflow at 393px.

The deterministic test suite remains separate and does not send its placeholder credentials to TMDB.

## Limits and remaining manual checks

Real audiovisual YouTube playback has not been verified. The live check confirms the trailer URL and iframe integration only. The automated suite intercepts video navigation.

Firefox, Safari, a physical mobile device, Lighthouse, deployment, and production hosting rewrites have not been verified. A static hosting provider must rewrite application routes to `index.html` for direct deep links.

The app's favorites and empty states can be viewed without credentials; movie screens show setup instructions when credentials are absent. The current local checkout has working credentials. No mock mode is enabled in production.

No push, merge to main, or deployment was performed.
