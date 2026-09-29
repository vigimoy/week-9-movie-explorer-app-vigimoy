export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  adult: boolean;
}
export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
export interface Genre { id: number; name: string }
export interface Person {
  id: number; name: string; profile_path: string | null; character?: string; job?: string;
}
export interface Video {
  id: string; key: string; name: string; site: string; type: string; official: boolean;
}
export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  tagline: string;
  credits: { cast: Person[]; crew: Person[] };
  videos: { results: Video[] };
  similar: MovieResponse;
  release_dates: {
    results: { iso_3166_1: string; release_dates: { certification: string; type: number }[] }[];
  };
}

