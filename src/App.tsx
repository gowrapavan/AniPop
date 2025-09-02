import React, { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { AnimeDetail } from './pages/AnimeDetail';
import { Watch } from './pages/Watch';
import { Movies } from './pages/Movies';
import { TvSeries } from './pages/TvSeries';
import { MostPopular } from './pages/MostPopular';
import { TopAiring } from './pages/TopAiring';
import { Genre } from './pages/Genre';
import { clearExpiredCache } from './lib/cache';

// Error Fallback Component
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-red-400">
          Something went wrong
        </h2>
        <p className="text-gray-400 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        return failureCount < 5;
      },
      retryDelay: (attemptIndex) => {
        const delay = Math.min(2000 * 2 ** attemptIndex, 32000);
        console.log(`Global retry in ${delay}ms (attempt ${attemptIndex + 1})`);
        return delay;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Clear expired cache on app start
clearExpiredCache();

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ScrollToTop /> {/* <-- always resets scroll on navigation */}
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/anime/:malId" element={<AnimeDetail />} />
                <Route path="/watch/anime/:malId" element={<Watch />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv" element={<TvSeries />} />
                <Route path="/popular" element={<MostPopular />} />
                <Route path="/top-airing" element={<TopAiring />} />
                <Route path="/genre/:genreName" element={<Genre />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
