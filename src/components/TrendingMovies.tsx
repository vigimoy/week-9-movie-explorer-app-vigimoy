import { useRef, useState } from 'react';
import type { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';
import { Icon } from './Icon';
import { Button } from './ui/button';

export function TrendingMovies({ movies }: { movies: Movie[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const scroll = (direction: number) => {
    const element = track.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };
  return (
    <div className="trending-wrap">
      <div
        className="trending-track"
        ref={track}
        tabIndex={0}
        aria-label="Trending movies"
        onScroll={(event) => {
          const element = event.currentTarget;
          setCanGoBack(element.scrollLeft > 10);
          setAtEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth - 10);
        }}
      >
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} rank={index + 1} />
        ))}
      </div>
      {canGoBack && (
        <Button
          variant="secondary"
          size="icon"
          className="carousel-arrow carousel-prev"
          aria-label="Previous trending movies"
          onClick={() => scroll(-1)}
        >
          <Icon name="arrow" />
        </Button>
      )}
      {!atEnd && movies.length > 2 && (
        <Button
          variant="secondary"
          size="icon"
          className="carousel-arrow"
          aria-label="Next trending movies"
          onClick={() => scroll(1)}
        >
          <Icon name="arrow" />
        </Button>
      )}
    </div>
  );
}
