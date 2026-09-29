import { useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useGenres, useNowPlayingMovies, usePopularMovies } from '@/hooks/useMovies';
import { isApiConfigured } from '@/lib/axios';
import { uniqueMovies } from '@/lib/utils';
import { MovieImage } from '@/components/MovieImage';
import { MovieCard } from '@/components/MovieCard';
import { TrendingMovies } from '@/components/TrendingMovies';
import { TrailerButton } from '@/components/TrailerDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState, ErrorState, MovieSkeletons, SetupState } from '@/components/States';
import { Page } from '@/components/Page';

const mobileQuery = '(max-width: 767px)';
function subscribeToViewport(callback: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
function HomeContent() {
  const popular = usePopularMovies();
  const releases = useNowPlayingMovies();
  const genres = useGenres();
  const [showFilters, setShowFilters] = useState(false);
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('default');
  const mobile = useSyncExternalStore(
    subscribeToViewport,
    () => window.matchMedia(mobileQuery).matches,
  );
  const pageSize = mobile ? 8 : 15;
  const [extraVisible, setExtraVisible] = useState(0);
  const featured = popular.data?.results[0];
  const allMovies = uniqueMovies(releases.data?.pages.flatMap((page) => page.results) ?? []);
  const movies = allMovies.filter((movie) => !genre || movie.genre_ids?.includes(Number(genre)));
  if (sort === 'rating') movies.sort((a, b) => b.vote_average - a.vote_average);
  if (sort === 'date') movies.sort((a, b) => b.release_date.localeCompare(a.release_date));
  if (sort === 'title') movies.sort((a, b) => a.title.localeCompare(b.title));
  const visibleMovies = movies.slice(0, pageSize + extraVisible);
  const hasMore = visibleMovies.length < movies.length || releases.hasNextPage;
  async function loadMore() {
    if (visibleMovies.length >= movies.length && releases.hasNextPage) {
      const result = await releases.fetchNextPage();
      if (result.isError) return;
    }
    setExtraVisible((count) => count + pageSize);
  }
  return (
    <Page>
      {popular.isPending ? (
        <div role="status" aria-label="Loading featured movie">
          <Skeleton className="hero-skeleton" />
        </div>
      ) : popular.isError ? (
        <div className="page-container pt-36">
          <ErrorState error={popular.error} retry={() => void popular.refetch()} />
        </div>
      ) : featured ? (
        <section className="hero" aria-label="Featured movie">
          <MovieImage
            path={featured.backdrop_path}
            alt=""
            className="hero-background"
            size="w1280"
            eager
          />
          <div className="page-container hero-content">
            <div className="hero-copy">
              <h1>{featured.title}</h1>
              <p>{featured.overview || 'Discover your next favorite movie.'}</p>
              <div className="hero-buttons">
                <TrailerButton movieId={featured.id} />
                <Button variant="secondary" asChild>
                  <Link to={`/movie/${featured.id}`}>See Detail</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="pt-28">
          <EmptyState title="No featured movies" description="Check back soon for more movies." />
        </div>
      )}
      <div className="page-container">
        <section className="movie-section" aria-labelledby="trending-title">
          <h2 id="trending-title">Trending Now</h2>
          {popular.isPending ? (
            <MovieSkeletons />
          ) : (
            popular.data && <TrendingMovies movies={popular.data.results} />
          )}
        </section>
        <section className="movie-section" aria-labelledby="releases-title">
          <div className="section-heading">
            <h2 id="releases-title">New Release</h2>
            <Button
              variant="secondary"
              className="filter-toggle"
              aria-expanded={showFilters}
              aria-controls="movie-filters"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              Filters
            </Button>
          </div>
          {showFilters && (
            <div id="movie-filters" className="filters">
              <div>
                <label htmlFor="genre-filter">Genre</label>
                <select
                  id="genre-filter"
                  value={genre}
                  onChange={(event) => setGenre(event.target.value)}
                >
                  <option value="">All genres</option>
                  {genres.data?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="sort-filter">Sort by</label>
                <select
                  id="sort-filter"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="rating">Highest rated</option>
                  <option value="date">Newest first</option>
                  <option value="title">Title A–Z</option>
                </select>
              </div>
              <p>
                Filters and sorting apply to loaded releases. Load more to explore further.
                {genres.isError && ' Genre options are temporarily unavailable.'}
              </p>
            </div>
          )}
          {releases.isPending ? (
            <MovieSkeletons count={10} />
          ) : releases.isError && !releases.data ? (
            <ErrorState error={releases.error} retry={() => void releases.refetch()} />
          ) : movies.length ? (
            <div className="movie-grid">
              {visibleMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No movies found"
              description={
                genre
                  ? 'Try another genre or load more movies.'
                  : 'New releases will appear here when available.'
              }
            />
          )}
          {releases.isFetchNextPageError && (
            <ErrorState error={releases.error} retry={() => void releases.fetchNextPage()} />
          )}
          {hasMore && (
            <div className="load-more">
              <Button
                variant="secondary"
                disabled={releases.isFetchingNextPage}
                onClick={() => void loadMore()}
              >
                {releases.isFetchingNextPage ? 'Loading…' : 'Load More'}
              </Button>
            </div>
          )}
        </section>
      </div>
    </Page>
  );
}
export default function HomePage() {
  return isApiConfigured ? <HomeContent /> : <SetupState />;
}
