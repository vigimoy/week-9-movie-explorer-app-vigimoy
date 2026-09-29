import type { Movie, MovieDetails } from '../../src/types/movie';

const titles = [
  'The Gorge',
  'Mufasa: The Lion King',
  'The Brutalist',
  'Companion',
  'Captain America: Brave New World',
  'Dog Man',
  'Conclave',
  'Flight Risk',
  'Paddington in Peru',
  'My Fault: London',
  'Mad About the Boy',
  'Better Man',
  'Sirens of the Deep',
  'Nosferatu',
  'September 5',
  'Anora',
  'Ne Zha 2',
  'The Last Showgirl',
  'Sonic the Hedgehog 3',
  'La Dolce Villa',
  'The Order',
];
const images = [
  'imgMovieImage',
  'imgImage',
  'imgImage2',
  'imgImage3',
  'imgImage4',
  'imgImage5',
  'imgImage6',
  'imgImage7',
  'imgImage8',
  'imgImage9',
  'imgImage10',
  'imgImage11',
  'imgImage12',
  'imgImage13',
  'imgImage14',
  'imgImage15',
  'imgImage16',
  'imgImage17',
  'imgImage18',
  'imgImage19',
  'imgImage20',
];
export const movies: Movie[] = titles.map((title, index) => ({
  id: index + 1,
  title,
  overview:
    index === 0
      ? 'Two highly trained operatives grow close from a distance after being sent to guard opposite sides of a mysterious gorge. When an evil below emerges, they must work together to survive what lies within.'
      : index === 4
        ? 'After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident. He must discover the reason behind a nefarious global plot before the true mastermind has the entire world seeing red.'
        : 'An unforgettable story of courage, unexpected friendships, and the choices that change everything.',
  poster_path: `/${images[index]}.png`,
  backdrop_path: index === 4 ? '/detail-imgImage2.png' : '/imgImage1.png',
  release_date: '2025-02-12',
  vote_average: index === 0 ? 7.9 : index === 4 ? 6.2 : 7.1,
  vote_count: 100,
  genre_ids: index % 2 ? [18] : [28],
  adult: false,
}));
export const pageOf = (results: Movie[], page = 1, total_pages = 1) => ({
  page,
  results,
  total_pages,
  total_results: results.length,
});
export function details(id: number): MovieDetails {
  const movie = movies.find((item) => item.id === id) || movies[0];
  return {
    ...movie,
    genres: [{ id: 28, name: 'Action' }],
    runtime: 118,
    tagline: '',
    credits: {
      cast: [
        {
          id: 1,
          name: 'Anthony Mackie',
          character: 'Sam Wilson / Captain America',
          profile_path: '/detail-imgImage3.png',
        },
        {
          id: 2,
          name: 'Harrison Ford',
          character: 'President Thaddeus Ross',
          profile_path: '/detail-imgImage1.png',
        },
        {
          id: 3,
          name: 'Danny Ramirez',
          character: 'Joaquin Torres',
          profile_path: '/detail-imgImage4.png',
        },
        {
          id: 4,
          name: 'Shira Haas',
          character: 'Ruth Bat-Seraph',
          profile_path: '/detail-imgImage5.png',
        },
        {
          id: 5,
          name: 'Tim Blake Nelson',
          character: 'Samuel Sterns',
          profile_path: '/detail-imgImage6.png',
        },
      ],
      crew: [{ id: 6, name: 'Julius Onah', job: 'Director', profile_path: null }],
    },
    videos: {
      results: [
        {
          id: 'trailer',
          key: 'a1b2c3d4e5f',
          site: 'YouTube',
          type: 'Trailer',
          name: 'Official trailer',
          official: true,
        },
      ],
    },
    similar: pageOf(movies.slice(0, 4)),
    release_dates: {
      results: [{ iso_3166_1: 'US', release_dates: [{ certification: 'PG-13', type: 3 }] }],
    },
  };
}
