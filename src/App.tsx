import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { AnimeDetail } from './pages/AnimeDetail';
import { Watch } from './pages/Watch';
import { clearExpiredCache } from './lib/cache';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Clear expired cache on app start
clearExpiredCache();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/anime/:malId" element={<AnimeDetail />} />
            <Route path="/watch/anime/:malId" element={<Watch />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;