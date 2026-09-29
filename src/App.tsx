import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MovieSkeletons } from '@/components/States';
import TrailerDialog from '@/components/TrailerDialog';

const HomePage = lazy(() => import('@/pages/HomePage'));
const MovieDetailPage = lazy(() => import('@/pages/MovieDetailPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="page-container list-page">
                <MovieSkeletons />
              </div>
            }
          >
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="movie/:id" element={<MovieDetailPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
          <TrailerDialog />
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  );
}
