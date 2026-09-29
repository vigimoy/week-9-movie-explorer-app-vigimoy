import { test, expect } from '@playwright/test';
import { mockTmdb, navigateToSearch, assertNoOverflow, readyForScreenshot } from './helpers';
import { details } from '../fixtures/movies';

test.beforeEach(async ({ page }) => {
  await mockTmdb(page);
});

test('browses home, loads more and filters loaded releases', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The Gorge', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'New Release', exact: true })).toBeVisible();
  await assertNoOverflow(page);
  await readyForScreenshot(page);
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true });
  await page.getByRole('button', { name: 'Load More' }).click();
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Load More' }).click();
  await expect(page.getByRole('heading', { name: 'Next Page Movie' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Load More' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await page.getByLabel('Genre', { exact: true }).selectOption('18');
  await expect(page.getByRole('heading', { name: 'Next Page Movie' })).toHaveCount(0);
  await page.getByLabel('Sort by').selectOption('title');
  const headings = await page
    .locator('section[aria-labelledby="releases-title"] .movie-card h3')
    .allTextContents();
  expect(headings).toEqual([...headings].sort((a, b) => a.localeCompare(b)));
  expect(errors).toEqual([]);
});

test('opens detail, plays trailer, persists favorites and removes them', async ({
  page,
}, testInfo) => {
  await page.goto('/movie/5');
  await expect(
    page.getByRole('heading', { name: 'Captain America: Brave New World', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('PG-13', { exact: true })).toBeVisible();
  await expect(page.getByText('Julius Onah')).toBeVisible();
  await assertNoOverflow(page);
  await readyForScreenshot(page);
  await page.screenshot({ path: testInfo.outputPath('detail.png'), fullPage: true });
  await page
    .getByRole('button', { name: 'Add Captain America: Brave New World to favorites' })
    .click();
  await expect(page.getByText('Movie successfully added to favorites')).toBeVisible();
  await page.getByRole('button', { name: 'Watch Trailer', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('iframe')).toHaveAttribute(
    'src',
    /youtube-nocookie\.com\/embed\/a1b2c3d4e5f/,
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/favorites');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Captain America: Brave New World' }),
  ).toBeVisible();
  await readyForScreenshot(page);
  await page.screenshot({ path: testInfo.outputPath('favorites.png'), fullPage: true });
  await page
    .getByRole('button', { name: 'Remove Captain America: Brave New World from favorites' })
    .click();
  await expect(page.getByText("You don't have a favorite movie yet")).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Data Empty' })).toBeVisible();
  await readyForScreenshot(page);
  await page.screenshot({ path: testInfo.outputPath('favorites-empty.png'), fullPage: true });
});

test('validates search, returns results, clears and handles empty results', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await navigateToSearch(page);
  await page.getByRole('textbox', { name: 'Search Movie' }).fill('   ');
  await page.getByRole('textbox', { name: 'Search Movie' }).press('Enter');
  await expect(page.getByText('Enter a movie title.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Search Movie' }).fill('Captain America');
  await page.getByRole('textbox', { name: 'Search Movie' }).press('Enter');
  await expect(page).toHaveURL(/search\?q=Captain%20America/);
  await expect(
    page.getByRole('heading', { name: 'Captain America: Brave New World' }),
  ).toBeVisible();
  await assertNoOverflow(page);
  await readyForScreenshot(page);
  await page.screenshot({ path: testInfo.outputPath('search.png'), fullPage: true });
  await page.getByRole('textbox', { name: 'Search Movie' }).fill('zzznomovie');
  await page.getByRole('textbox', { name: 'Search Movie' }).press('Enter');
  await expect(page.getByRole('heading', { name: 'Data Not Found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByRole('textbox', { name: 'Search Movie' })).toHaveValue('');
  await expect(page.getByRole('heading', { name: 'Find your next favorite' })).toBeVisible();
});

test('handles errors and retries without losing the page', async ({ page }) => {
  let fail = true;
  await page.route('https://api.themoviedb.org/3/movie/popular**', (route) => {
    if (fail) return route.fulfill({ status: 401, json: { status_message: 'Invalid API key' } });
    return route.fallback();
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Your TMDB credentials are invalid');
  fail = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: 'The Gorge', exact: true }).first()).toBeVisible();
});

test('shows loading, missing images, no trailer and unrated certification', async ({ page }) => {
  await page.route('https://api.themoviedb.org/3/movie/5**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({
      json: {
        ...details(5),
        poster_path: null,
        videos: { results: [] },
        release_dates: { results: [] },
      },
    });
  });
  await page.goto('/movie/5');
  await expect(page.getByRole('status', { name: 'Loading movie details' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Trailer unavailable' })).toBeDisabled();
  await expect(page.getByText('Not rated', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('img', { name: 'Captain America: Brave New World poster' }),
  ).toBeVisible();
});

test('handles invalid routes and corrupted browser storage', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('movie-favorites', '{broken-json'));
  await page.goto('/favorites');
  await expect(page.getByRole('heading', { name: 'Data Empty' })).toBeVisible();
  await page.goto('/movie/not-an-id');
  await expect(page.getByRole('heading', { name: 'Movie not found' })).toBeVisible();
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('shows setup instructions without an API key and makes no TMDB requests', async ({
  page,
}, testInfo) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('api.themoviedb.org')) requests.push(request.url());
  });
  await page.goto('http://127.0.0.1:4174');
  await expect(page.getByRole('heading', { name: 'A world of movies awaits.' })).toBeVisible();
  await assertNoOverflow(page);
  await page.screenshot({ path: testInfo.outputPath('setup.png'), fullPage: true });
  expect(requests).toEqual([]);
});

test('mobile menu supports keyboard close and navigation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile navigation only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Favorites' })
    .click();
  await expect(page).toHaveURL(/\/favorites$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('keeps content and static assets usable at narrow and tablet widths', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Runs the custom viewport matrix once');
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'The Gorge', exact: true }).first(),
    ).toBeVisible();
    await assertNoOverflow(page);
    await page.goto('/movie/5');
    await expect(
      page.getByRole('heading', { name: 'Captain America: Brave New World', exact: true }),
    ).toBeVisible();
    await assertNoOverflow(page);
    await readyForScreenshot(page);
    const brokenAssets = await page
      .locator('img[src^="/assets/figma/"]')
      .evaluateAll((images) =>
        images
          .filter((image) => !(image as HTMLImageElement).naturalWidth)
          .map((image) => image.getAttribute('src')),
      );
    expect(brokenAssets).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`detail-${width}.png`), fullPage: true });
  }
});
