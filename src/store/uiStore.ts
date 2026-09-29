import { create } from 'zustand';
interface UiState {
  trailerMovieId: number | null;
  openTrailer: (id: number | null) => void;
  notification: { message: string; id: number } | null;
  notify: (message: string) => void;
  clearNotification: () => void;
}
export const useUiStore = create<UiState>((set) => ({
  trailerMovieId: null,
  openTrailer: (trailerMovieId) => set({ trailerMovieId }),
  notification: null,
  notify: (message) => set({ notification: { message, id: Date.now() } }),
  clearNotification: () => set({ notification: null }),
}));
