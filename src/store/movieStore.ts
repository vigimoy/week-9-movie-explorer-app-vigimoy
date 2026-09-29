import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { z } from 'zod';
import type { Movie } from '@/types/movie';

const savedMovieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  genre_ids: z.array(z.number()).optional(),
  adult: z.boolean(),
});
interface MovieStore {
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => void;
}
export const useMovieStore = create<MovieStore>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (movie) =>
        set((state) => ({
          favorites: state.favorites.some((item) => item.id === movie.id)
            ? state.favorites.filter((item) => item.id !== movie.id)
            : [...state.favorites, savedMovieSchema.parse(movie)],
        })),
    }),
    {
      name: 'movie-favorites',
      version: 1,
      // Storage can be denied in private mode; favorites still work in memory.
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            if (value) JSON.parse(value);
            return value;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch {
            /* Keep in-memory state. */
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            /* Storage unavailable. */
          }
        },
      })),
      partialize: (state) => ({ favorites: state.favorites }),
      merge: (persisted, current) => {
        const result = z.object({ favorites: z.array(savedMovieSchema) }).safeParse(persisted);
        return { ...current, favorites: result.success ? result.data.favorites : [] };
      },
    },
  ),
);
