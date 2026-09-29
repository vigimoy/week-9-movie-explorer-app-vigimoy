import { Link, useParams } from 'react-router-dom';
import { useMovieDetails } from '@/hooks/useMovies';
import { isApiConfigured } from '@/lib/axios';
import { formatDate, formatRuntime, getCertification, getTrailer } from '@/lib/utils';
import { MovieImage } from '@/components/MovieImage';
import { FavoriteButton } from '@/components/FavoriteButton';
import { TrailerButton } from '@/components/TrailerDialog';
import { Icon } from '@/components/Icon';
import { MovieCard } from '@/components/MovieCard';
import { EmptyState, ErrorState, SetupState } from '@/components/States';
import { Skeleton } from '@/components/ui/skeleton';
import { Page } from '@/components/Page';
import type { Person } from '@/types/movie';

function CastCard({ person }: { person: Person }) {
  return (
    <article className="cast-card">
      <MovieImage path={person.profile_path} alt={person.name} size="w185" />
      <div>
        <h3>{person.name}</h3>
        <p>{person.character || person.job}</p>
      </div>
    </article>
  );
}
function DetailContent({ id }: { id: number }) {
  const query = useMovieDetails(id);
  if (query.isPending)
    return (
      <div className="page-container list-page" role="status" aria-label="Loading movie details">
        <Skeleton className="detail-skeleton" />
        <Skeleton className="hero-skeleton" />
      </div>
    );
  if (query.isError)
    return (
      <div className="page-container list-page">
        <ErrorState error={query.error} retry={() => void query.refetch()} />
        <Link to="/">← Back to home</Link>
      </div>
    );
  const movie = query.data;
  const cast = movie.credits?.cast.slice(0, 6) ?? [];
  const crew =
    movie.credits?.crew
      .filter((person) => ['Director', 'Screenplay', 'Writer'].includes(person.job || ''))
      .slice(0, 3) ?? [];
  return (
    <Page className="detail-page">
      <MovieImage
        path={movie.backdrop_path}
        alt=""
        className="hero-background"
        size="w1280"
        eager
      />
      <div className="page-container detail-content">
        <div className="detail-heading">
          <MovieImage
            path={movie.poster_path}
            alt={`${movie.title} poster`}
            className="detail-poster"
            eager
          />
          <div className="detail-title">
            <h1>{movie.title}</h1>
            <p className="release-date">
              <Icon name="calendar" />
              {formatDate(movie.release_date)}
              <span className="runtime"> · {formatRuntime(movie.runtime)}</span>
            </p>
          </div>
          <div className="detail-actions">
            <TrailerButton movieId={movie.id} disabled={!getTrailer(movie.videos?.results)} />
            <FavoriteButton movie={movie} />
          </div>
          <dl className="detail-stats">
            <div className="stat">
              <Icon name="star-large" />
              <dt>Rating</dt>
              <dd>{movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'Not rated'}</dd>
            </div>
            <div className="stat">
              <Icon name="genre" />
              <dt>Genre</dt>
              <dd>{movie.genres[0]?.name || 'Unknown'}</dd>
            </div>
            <div className="stat">
              <Icon name="age" />
              <dt>Age Limit</dt>
              <dd>{getCertification(movie)}</dd>
            </div>
          </dl>
        </div>
        <section className="detail-section">
          <h2>Overview</h2>
          <p>{movie.overview || 'No overview available for this movie.'}</p>
          {movie.genres.length > 1 && (
            <div className="genre-tags" aria-label="All genres">
              {movie.genres.map((genre) => (
                <span key={genre.id}>{genre.name}</span>
              ))}
            </div>
          )}
        </section>
        <section className="detail-section">
          <h2>Cast &amp; Crew</h2>
          {cast.length || crew.length ? (
            <div className="cast-grid">
              {[...cast, ...crew].map((person, index) => (
                <CastCard key={`${person.id}-${index}`} person={person} />
              ))}
            </div>
          ) : (
            <p>Cast and crew information is not available yet.</p>
          )}
        </section>
        <section className="detail-section">
          <h2>Similar Movies</h2>
          {movie.similar?.results.length ? (
            <div className="movie-grid">
              {movie.similar.results
                .filter((similar) => similar.id !== movie.id)
                .slice(0, 5)
                .map((similar) => (
                  <MovieCard key={similar.id} movie={similar} />
                ))}
            </div>
          ) : (
            <p>No similar movies available yet.</p>
          )}
        </section>
      </div>
    </Page>
  );
}
export default function MovieDetailPage() {
  const { id } = useParams();
  const movieId = Number(id);
  if (!id || !/^\d+$/.test(id) || !Number.isSafeInteger(movieId) || movieId <= 0)
    return (
      <div className="list-page">
        <EmptyState title="Movie not found" description="This movie link is not valid." explore />
      </div>
    );
  return isApiConfigured ? <DetailContent key={movieId} id={movieId} /> : <SetupState />;
}
