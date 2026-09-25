import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import App from './App.tsx';

// TODO: Configure QueryClient with appropriate default options
// Reference: https://tanstack.com/query/latest/docs/framework/react/reference/QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TODO: Configure default query options
      // Examples: refetchOnWindowFocus, retry, staleTime, etc.
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* React Query Devtools - useful for debugging */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
