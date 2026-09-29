import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function EmptyState({
  title = 'Data Empty',
  description,
  explore = false,
}: {
  title?: string;
  description: string;
  explore?: boolean;
}) {
  return (
    <div className="empty-state">
      <img src="/assets/figma/empty.png" alt="" width="200" height="200" />
      <h2>{title}</h2>
      <p>{description}</p>
      {explore && (
        <Button asChild>
          <Link to="/">Explore Movie</Link>
        </Button>
      )}
    </div>
  );
}
export function ErrorState({ error, retry }: { error: Error | null; retry?: () => void }) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={32} aria-hidden="true" />
      <h2>Something went wrong</h2>
      <p>{error?.message || 'Unable to load movies. Please try again.'}</p>
      {retry && (
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  );
}
export function MovieSkeletons({ count = 5 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading movies" className="movie-grid">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="poster-skeleton" />
          <Skeleton className="title-skeleton" />
          <Skeleton className="rating-skeleton" />
        </div>
      ))}
      <span className="sr-only">Loading movies…</span>
    </div>
  );
}
export function SetupState() {
  return (
    <section className="setup-state page-container">
      <span className="eyebrow">MOVIE EXPLORER</span>
      <h1>A world of movies awaits.</h1>
      <p>
        Connect your free TMDB API key to discover movies, watch trailers, and build your favorites.
      </p>
      <ol>
        <li>
          Create an account at{' '}
          <a href="https://www.themoviedb.org/signup" target="_blank" rel="noreferrer">
            The Movie Database
          </a>
          .
        </li>
        <li>Request a developer API key in your account’s API settings.</li>
        <li>
          Copy <code>.env.example</code> to <code>.env</code> and fill in{' '}
          <code>VITE_TMDB_API_KEY</code>.
        </li>
        <li>Restart the development server to load your key.</li>
      </ol>
      <Button asChild>
        <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
          Get a TMDB API key
        </a>
      </Button>
    </section>
  );
}
