# Figma implementation notes

Source file: UBm7Fz1KTZiKJqw0jmo08i, page 8411:143671. Design context and screenshots were read before implementation.

| Screen           | Desktop node | Mobile node |
| ---------------- | ------------ | ----------- |
| Home             | 22411:1644   | 22421:4320  |
| Detail           | 22417:1500   | 22421:4938  |
| Favorites filled | 22419:2721   | 22421:5713  |
| Favorites empty  | 22424:8096   | 22424:9185  |
| Search found     | 22419:3282   | 22424:6970  |

## Tokens and geometry

- Poppins 400/600/700, hosted with the application.
- Black canvas; text #fdfdfd; secondary text #a4a7ae.
- Primary button #961200; borders #252b37 and #181d27.
- Desktop content 1160px at 1440px viewport, 140px side margins.
- Mobile 393px reference width, 16px side margins.
- Header 90px desktop / 64px mobile; footer 120px.
- Desktop hero title 48/60; mobile 28/36.
- Poster columns: five desktop, four tablet, two mobile.
- Film posters: 216:321 aspect ratio desktop; 173:258 mobile.
- Detail poster: 260×384 desktop / 116×171 mobile.
- Buttons: 52px desktop / 44px mobile, pill corners.

## Assets

Production static assets are original Figma exports in `public/assets/figma/`.
Their SVG root dimensions are preserved; layout wrappers position the icons.

| Files                         | Placement                                                                |
| ----------------------------- | ------------------------------------------------------------------------ |
| logo.svg, logo-mobile.svg     | Header/footer brand: 40px / 28px                                         |
| search.svg, search-mobile.svg | Search field / mobile header                                             |
| play.svg                      | Trailer buttons, 22px intrinsic                                          |
| star.svg                      | Card/list ratings, 18.33px intrinsic                                     |
| star-large.svg                | Detail rating tile                                                       |
| heart.svg, heart-filled.svg   | Favorite control states, 24px                                            |
| calendar.svg                  | Detail release date, 24px                                                |
| genre.svg, age.svg            | Detail stat tiles, 32px desktop, wrapper scaled on mobile                |
| arrow.svg                     | Carousel, original upward arrow rotated 90° or −90°                      |
| menu.svg                      | Mobile navigation trigger, 24px                                          |
| empty.png                     | Export of the complete 200×200 empty-state illustration, node 22424:9144 |

Movie backdrops, posters, cast photographs, titles, and ratings remain API data. The design screenshot is never used as the application background or UI implementation.

## Deliberate functional additions

The README also requires runtime, crew, recommendations, filtering, loading/error handling, and meaningful navigation. These are added using the existing colors, spacing, and typography. The reference's hardcoded rating/age/date is replaced with real data. Search includes a results summary for feedback. Grid titles truncate visually but retain full accessible link names.

Load More appears after readable movie rows rather than covering interactive poster links with an opaque fade. Mobile first-load count is eight films, matching the reference. No iOS keyboard mockup is rendered; the browser opens the device keyboard.

The setup page, retry states, and not-found screen cover states absent from Figma.
