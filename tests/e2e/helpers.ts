import { expect, type Page } from '@playwright/test';
import path from 'node:path';
import { details, movies, pageOf } from '../fixtures/movies';

export async function mockTmdb(page: Page) {
  await page.route('https://image.tmdb.org/**', async (route) => {
    const filename = new URL(route.request().url()).pathname.split('/').pop()!;
    await route.fulfill({
      path: path.resolve('tests/fixtures/images', path.basename(filename).replace('.png', '.jpg')),
      contentType: 'image/jpeg',
    });
  });
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html><body>Trailer player test fixture</body></html>',
    }),
  );
  await page.route('https://api.themoviedb.org/**', async (route) => {
    const url = new URL(route.request().url());
    let body: unknown;
    if (url.pathname.endsWith('/movie/popular')) body = pageOf(movies.slice(0, 6));
    else if (url.pathname.endsWith('/movie/now_playing')) {
      const pageNumber = Number(url.searchParams.get('page') || 1);
      body = pageOf(
        pageNumber === 1 ? movies.slice(6) : [{ ...movies[0], id: 50, title: 'Next Page Movie' }],
        pageNumber,
        2,
      );
    } else if (url.pathname.endsWith('/genre/movie/list'))
      body = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 18, name: 'Drama' },
        ],
      };
    else if (url.pathname.endsWith('/search/movie')) {
      const term = url.searchParams.get('query')!.toLowerCase();
      body = pageOf(movies.filter((movie) => movie.title.toLowerCase().includes(term)));
    } else body = details(Number(url.pathname.split('/').pop()));
    await route.fulfill({ json: body });
  });
}
export async function navigateToSearch(page: Page) {
  await expect(page.getByRole('banner')).toBeVisible();
  if (await page.getByRole('link', { name: 'Open search' }).isVisible())
    await page.getByRole('link', { name: 'Open search' }).click();
}
export async function assertNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}
export async function readyForScreenshot(page: Page) {
  await expect(page.locator('main > div').first()).toHaveCSS('opacity', '1');
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const img of document.images) img.loading = 'eager';
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
  });
}
