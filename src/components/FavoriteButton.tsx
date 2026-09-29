import type { Movie } from '@/types/movie';
import { useMovieStore } from '@/store/movieStore';
import { useUiStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { Icon } from './Icon';

export function FavoriteButton({ movie }: { movie: Movie }) {
  const saved = useMovieStore((state) => state.favorites.some((item) => item.id === movie.id));
  const toggleFavorite = useMovieStore((state) => state.toggleFavorite);
  const notify = useUiStore((state) => state.notify);
  return (
    <Button
      variant="secondary"
      size="icon"
      aria-pressed={saved}
      aria-label={`${saved ? 'Remove' : 'Add'} ${movie.title} ${saved ? 'from' : 'to'} favorites`}
      onClick={() => {
        toggleFavorite(movie);
        notify(saved ? 'Movie removed from favorites' : 'Movie successfully added to favorites');
      }}
    >
      <Icon name={saved ? 'heart-filled' : 'heart'} />
    </Button>
  );
}
