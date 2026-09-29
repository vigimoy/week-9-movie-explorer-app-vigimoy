import { useState } from 'react';
import { Film } from 'lucide-react';
import { getImageUrl, cn } from '@/lib/utils';

export function MovieImage({
  path,
  alt,
  size = 'w500',
  className,
  eager = false,
}: {
  path: string | null | undefined;
  alt: string;
  size?: string;
  className?: string;
  eager?: boolean;
}) {
  const [failedPath, setFailedPath] = useState<string>();
  const src = getImageUrl(path, size);
  return (
    <div className={cn('movie-image', className)}>
      {src && failedPath !== src ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailedPath(src)}
        />
      ) : (
        <div className="image-fallback" role="img" aria-label={alt || 'Image unavailable'}>
          <Film aria-hidden="true" />
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  );
}
