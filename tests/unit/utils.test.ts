import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatRuntime,
  getCertification,
  getImageUrl,
  getTrailer,
  uniqueMovies,
} from '../../src/lib/utils';
import { details, movies } from '../fixtures/movies';

describe('TMDB data edge cases', () => {
  it('does not request nonexistent image paths', () => {
    expect(getImageUrl(null)).toBeUndefined();
    expect(getImageUrl('')).toBeUndefined();
    expect(getImageUrl('/poster.png', 'w342')).toBe('https://image.tmdb.org/t/p/w342/poster.png');
  });
  it('handles missing dates and runtimes', () => {
    expect(formatDate('')).toBe('Release date unavailable');
    expect(formatDate('2025-02-12')).toBe('12 February 2025');
    expect(formatRuntime(null)).toBe('Runtime unavailable');
    expect(formatRuntime(118)).toBe('1h 58m');
  });
  it('selects official YouTube trailers and rejects unsafe video keys', () => {
    const trailer = details(1).videos.results[0];
    expect(
      getTrailer([
        { ...trailer, official: false },
        { ...trailer, id: 'official' },
      ])?.id,
    ).toBe('official');
    expect(getTrailer([{ ...trailer, key: '../bad?url=' }])).toBeUndefined();
    expect(getTrailer([{ ...trailer, site: 'Vimeo' }])).toBeUndefined();
  });
  it('does not invent an age certification when unavailable', () => {
    expect(getCertification(details(1))).toBe('PG-13');
    expect(getCertification({ ...details(1), release_dates: { results: [] } })).toBe('Not rated');
  });
  it('deduplicates overlapping pagination results', () => {
    expect(uniqueMovies([movies[0], movies[1], movies[0]])).toHaveLength(2);
  });
});
