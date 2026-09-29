import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useMovieDetails } from '@/hooks/useMovies';
import { getTrailer } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { EmptyState, ErrorState } from './States';
import { Icon } from './Icon';

export function TrailerButton({
  movieId,
  disabled = false,
}: {
  movieId: number;
  disabled?: boolean;
}) {
  const openTrailer = useUiStore((state) => state.openTrailer);
  return (
    <Button className="trailer-button" onClick={() => openTrailer(movieId)} disabled={disabled}>
      {disabled ? 'Trailer unavailable' : 'Watch Trailer'}
      <Icon name="play" />
    </Button>
  );
}
export default function TrailerDialog() {
  const movieId = useUiStore((state) => state.trailerMovieId);
  const openTrailer = useUiStore((state) => state.openTrailer);
  const query = useMovieDetails(movieId ?? 0, movieId !== null);
  const trailer = getTrailer(query.data?.videos?.results);
  return (
    <Dialog.Root
      open={movieId !== null}
      onOpenChange={(open) => {
        if (!open) openTrailer(null);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="trailer-dialog">
          <div className="dialog-heading">
            <Dialog.Title>{query.data?.title || 'Movie trailer'}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close trailer">
                <X />
              </Button>
            </Dialog.Close>
          </div>
          <Dialog.Description>Watch the official trailer on YouTube.</Dialog.Description>
          {query.isPending ? (
            <div role="status" aria-label="Loading trailer">
              <Skeleton className="trailer-frame" />
            </div>
          ) : query.isError ? (
            <ErrorState error={query.error} retry={() => void query.refetch()} />
          ) : trailer ? (
            <>
              <iframe
                className="trailer-frame"
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`}
                title={trailer.name}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a
                className="external-trailer"
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
              >
                Open on YouTube
              </a>
            </>
          ) : (
            <EmptyState
              title="Trailer unavailable"
              description="There is no trailer available for this movie yet."
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
