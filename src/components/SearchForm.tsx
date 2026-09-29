import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Icon } from './Icon';

const schema = z.object({ query: z.string().trim().min(1, 'Enter a movie title.').max(100, 'Use no more than 100 characters.') });
export function SearchForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = useId();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema), values: { query: params.get('q') || '' },
  });
  return <form className="search-form" role="search" onSubmit={handleSubmit(({ query }) => navigate(`/search?q=${encodeURIComponent(query)}`))}>
    <div className="search-field">
      <button type="submit" aria-label="Search movies"><Icon name="search" /></button>
      <label htmlFor={id} className="sr-only">Search Movie</label>
      <Input id={id} {...register('query')} placeholder="Search Movie" autoFocus={autoFocus} autoComplete="off" maxLength={100}
        aria-invalid={Boolean(errors.query)} aria-describedby={errors.query ? `${id}-error` : undefined} />
      {params.get('q') && <button type="button" aria-label="Clear search" onClick={() => { reset({ query: '' }); navigate('/search'); }}><X size={18} /></button>}
    </div>
    {errors.query && <p id={`${id}-error`} className="form-error" role="alert">{errors.query.message}</p>}
  </form>;
}

