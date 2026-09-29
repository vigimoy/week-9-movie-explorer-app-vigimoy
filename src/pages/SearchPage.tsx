import { useSearchParams } from 'react-router-dom';
import { useSearchMovies } from '@/hooks/useMovies';
import { isApiConfigured } from '@/lib/axios';
import { uniqueMovies } from '@/lib/utils';
import { MovieRow } from '@/components/MovieRow';
import { EmptyState, ErrorState, MovieSkeletons, SetupState } from '@/components/States';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/Page';

function Results({ term }: { term: string }) {
  const query = useSearchMovies(term);
  const movies = uniqueMovies(query.data?.pages.flatMap((page) => page.results) ?? []);
  if (query.isPending) return <MovieSkeletons />;
  if (query.isError && !query.data)
    return <ErrorState error={query.error} retry={() => void query.refetch()} />;
  if (!movies.length) return <EmptyState title="Data Not Found" description="Try other keywords" />;
  return (
    <>
      <p className="search-summary" role="status">
        {query.data?.pages[0].total_results.toLocaleString()} results for “{term}”
      </p>
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieRow key={movie.id} movie={movie} />
        ))}
      </div>
      {query.isFetchNextPageError && (
        <ErrorState error={query.error} retry={() => void query.fetchNextPage()} />
      )}
      {query.hasNextPage && (
        <div className="load-more">
          <Button
            variant="secondary"
            disabled={query.isFetchingNextPage}
            onClick={() => void query.fetchNextPage()}
          >
            {query.isFetchingNextPage ? 'Loading…' : 'Load More'}
          </Button>
        </div>
      )}
    </>
  );
}
export default function SearchPage() {
  const [params] = useSearchParams();
  const term = (params.get('q') || '').trim();
  if (term && !isApiConfigured) return <SetupState />;
  return (
    <Page className="page-container list-page search-page">
      <h1 className="sr-only">Search movies</h1>
      {term.length > 100 ? (
        <EmptyState title="Search is too long" description="Use no more than 100 characters." />
      ) : term ? (
        <Results key={term} term={term} />
      ) : (
        <EmptyState
          title="Find your next favorite"
          description="Search for a movie using the search bar above."
        />
      )}
    </Page>
  );
}
