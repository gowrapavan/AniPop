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
              Your ultimate destination for watching anime online. Stream thousands of episodes in HD quality with subtitles and dubbing.
            </p>
            <div className="flex gap-3">
              <a href="https://discord.gg/hianime" target="_blank" rel="noopener noreferrer" 
                 className="w-8 h-8 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="https://t.me/hianime" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 bg-[#0088cc] hover:bg-[#006ba6] rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="https://reddit.com/r/hianime" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 bg-[#FF4500] hover:bg-[#e03d00] rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </a>
              <a href="https://twitter.com/hianime" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 bg-[#1DA1F2] hover:bg-[#1a91da] rounded-lg flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/tv" className="text-gray-400 hover:text-white transition-colors text-sm">
                  TV Series
                </Link>
              </li>
              <li>
                <Link to="/popular" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Most Popular
                </Link>
              </li>
              <li>
                <Link to="/top-airing" className="text-gray-400 hover:text-white transition-colors text-sm">
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
                <Link to="/genre/action" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Action
                </Link>
              </li>
              <li>
                <Link to="/genre/adventure" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Adventure
                </Link>
              </li>
              <li>
                <Link to="/genre/comedy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Comedy
                </Link>
              </li>
              <li>
                <Link to="/genre/drama" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Drama
                </Link>
              </li>
              <li>
                <Link to="/genre/fantasy" className="text-gray-400 hover:text-white transition-colors text-sm">
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
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Watch2gether
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Rss className="w-4 h-4" />
                  News & Updates
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
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
              <span>© {currentYear} HiAnime. All rights reserved.</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/dmca" className="text-gray-400 hover:text-white transition-colors">
                DMCA
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-xs leading-relaxed text-center md:text-left">
              <strong>Disclaimer:</strong> This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services. 
              All content is provided by non-affiliated third parties.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}