import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  Globe,
  Rss,
  User,
  Menu,
  X,
  Command as Random,
  Users,
} from 'lucide-react';
import { Button } from './ui/Button';
import { debounce } from '../lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize the search handler to prevent recreation on every render
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false); // Close mobile menu after search
    }
  }, [searchQuery, navigate]);

  // Debounced navigation to search page
  const debouncedNavigateToSearch = useMemo(
    () => debounce(() => {
      navigate('/search');
      setIsMenuOpen(false);
    }, 100),
    [navigate]
  );

  const handleSearchIconClick = useCallback(() => {
    debouncedNavigateToSearch();
  }, [debouncedNavigateToSearch]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
 {/* Left: Logo + Mobile menu toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <Link to="/" className="flex items-center gap-2">
              {/* Replace H box with logo */}
              <img
                src="/img/logo.png" // <-- your AniPop! logo path
                alt="AniPop! Logo"
                className="h-12 w-15 rounded-lg shadow-glow"
              />             
            </Link>
          </div>

          {/* Center: Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="flex-1 bg-black/50 border border-white/20 rounded-l-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors backdrop-blur-sm"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-none border-l-0 border-white/20 hover:bg-white/10 bg-black/40 backdrop-blur-sm"
                  onClick={handleSearchIconClick}
                >
                  <Filter className="w-4 h-4 text-gray-300" />
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  className="rounded-l-none shadow-glow hover:shadow-glow-lg"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right: Desktop nav */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="glass-effect text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Users className="w-4 h-4 mr-2" /> Watch2gether
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="glass-effect text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Random className="w-4 h-4 mr-2" /> Random
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="glass-effect text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Globe className="w-4 h-4 mr-2" /> EN
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="glass-effect text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Rss className="w-4 h-4 mr-2" /> News
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="glass-effect text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Users className="w-4 h-4 mr-2" /> Community
            </Button>
            <Button variant="gradient" size="sm" className="shadow-glow">
              <User className="w-4 h-4 mr-2" /> Login
            </Button>
          </div>

          {/* Mobile: Login + Search icon */}
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={handleSearchIconClick}
              className="text-gray-300 hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>
            <Button variant="gradient" size="sm" className="shadow-glow">
              <User className="w-4 h-4 mr-1" /> Login
            </Button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 animate-slide-down glass-effect">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="justify-start text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Users className="w-4 h-4 mr-2" /> Watch2gether
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Random className="w-4 h-4 mr-2" /> Random
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Globe className="w-4 h-4 mr-2" /> Language
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Rss className="w-4 h-4 mr-2" /> News
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Users className="w-4 h-4 mr-2" /> Community
              </Button>

              {/* Mobile search input */}
              <form onSubmit={handleSearch} className="mt-2" key="mobile-search">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search anime..."
                    className="flex-1 bg-black/50 border border-white/20 rounded-l-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors backdrop-blur-sm"
                  />
                  <Button
                    type="submit"
                    variant="gradient"
                    className="rounded-l-none shadow-glow"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
