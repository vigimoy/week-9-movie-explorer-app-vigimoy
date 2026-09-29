import { useMovieStore } from '@/store/movieStore';
import { MovieRow } from '@/components/MovieRow';
import { EmptyState } from '@/components/States';
import { Page } from '@/components/Page';
export default function FavoritesPage() {
  const favorites = useMovieStore((state) => state.favorites);
  return (
    <Page className="page-container list-page">
      <h1>Favorites</h1>
      {favorites.length ? (
        <div className="movie-list">
          {favorites.map((movie) => (
            <MovieRow key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState description="You don't have a favorite movie yet" explore />
      )}
    </Page>
  );
}
