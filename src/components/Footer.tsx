import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, MessageCircle, Globe, Users, Rss } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800 mt-16">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/img/logo.png"
                alt="AniPop"
                className="w-13 h-13 object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for watching anime online. Stream
              thousands of episodes in HD quality with subtitles and dubbing.
            </p>
            <div className="flex gap-3">
              <a
                href="https://discord.gg/hianime"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515..."></path>
                </svg>
              </a>
              <a
                href="https://t.me/hianime"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#0088cc] hover:bg-[#006ba6] rounded-lg flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12..."></path>
                </svg>
              </a>
              <a
                href="https://reddit.com/r/hianime"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#FF4500] hover:bg-[#e03d00] rounded-lg flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0A12 12 0 0 0 0 12..."></path>
                </svg>
              </a>
              <a
                href="https://twitter.com/hianime"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#1DA1F2] hover:bg-[#1a91da] rounded-lg flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825..."></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/movies"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/tv-series"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  TV Series
                </Link>
              </li>
              <li>
                <Link
                  to="/most-popular"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Most Popular
                </Link>
              </li>
              <li>
                <Link
                  to="/top-airing"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Top Airing
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/genre/action"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Action
                </Link>
              </li>
              <li>
                <Link
                  to="/genre/adventure"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Adventure
                </Link>
              </li>
              <li>
                <Link
                  to="/genre/comedy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Comedy
                </Link>
              </li>
              <li>
                <Link
                  to="/genre/drama"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Drama
                </Link>
              </li>
              <li>
                <Link
                  to="/genre/fantasy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Fantasy
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Community</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Watch2gether
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Community Forum
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Rss className="w-4 h-4" />
                  News & Updates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Language: EN
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {currentYear} AniPop. All rights reserved.</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/dmca"
                className="text-gray-400 hover:text-white transition-colors"
              >
                DMCA
              </Link>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-xs leading-relaxed text-center md:text-left">
              <strong>Disclaimer:</strong> This site does not store any files on
              our server, we only linked to the media which is hosted on 3rd
              party services. All content is provided by non-affiliated third
              parties.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
