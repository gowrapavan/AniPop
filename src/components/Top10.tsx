// src/components/Top10.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  episodes?: number;
  year?: number;
  images: {
    jpg: { image_url: string };
  };
}

const tabs = ['Today', 'Week', 'Month'] as const;
type Tab = (typeof tabs)[number];

export function Top10() {
  const [activeTab, setActiveTab] = useState<Tab>('Today');
  const [data, setData] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch function with retry
  const fetchTopAnime = async (tab: Tab, retry = true) => {
    setIsLoading(true);
    try {
      let url = '/top/anime?limit=10';

      if (tab === 'Week') {
        url = '/top/anime?filter=bypopularity&limit=10';
      } else if (tab === 'Month') {
        url = '/top/anime?filter=favorite&limit=10';
      }

      const res = await fetch(`https://api.jikan.moe/v4${url}`);
      const json = await res.json();

      if (Array.isArray(json.data) && json.data.length > 0) {
        setData(json.data);
      } else if (retry) {
        console.warn(`Retrying fetch for ${tab}...`);
        setTimeout(() => fetchTopAnime(tab, false), 500);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error('Failed to fetch top anime:', err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopAnime(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="top10-container bg-[#111] rounded-3xl shadow-xl overflow-hidden border border-gray-800"
    >
      {/* Header */}
      <div className="top10-header p-4 border-b border-gray-800">
        <h3 className="top10-title text-xl font-bold text-white flex items-center gap-2 mb-3">
          <Crown className="w-5 h-5 text-yellow-400" />
          Top 10 Anime
        </h3>
        <div className="top10-tabs flex gap-2 bg-gray-900 p-1 rounded-full w-fit">
          {tabs.map((label) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`top10-tab px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === label
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="top10-content p-4">
        {isLoading ? (
          <div className="top10-skeleton space-y-3">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="top10-skeleton-item flex items-center gap-3 p-2">
                <div className="top10-skeleton-rank w-8 h-8 bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="top10-skeleton-poster w-12 h-16 bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="top10-skeleton-info flex-1">
                  <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="top10-list space-y-3 ">
            {data.slice(0, 10).map((anime, index) => (
              <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="top10-item flex items-center gap-4 p-3  rounded-sm bg-gray-900/50 hover:bg-gray-800/70 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  {/* Rank Badge */}
                  <div
                    className={`top10-rank w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg ${
                      index === 0
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-yellow-400/40'
                        : index === 1
                        ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-black shadow-gray-400/40'
                        : index === 2
                        ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-white shadow-amber-700/40'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Poster */}
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="top10-poster w-14 h-20 object-cover rounded-lg shadow-md"
                  />

                  {/* Info */}
                  <div className="top10-info flex-1 min-w-0 overflow-hidden">
                    <h4 className="top10-name text-white text-base font-semibold truncate">
                      {anime.title_english || anime.title}
                    </h4>
                    <div className="top10-meta flex items-center gap-2 text-xs text-gray-400 mt-1">
                      {anime.episodes && <span>{anime.episodes} eps</span>}
                      {anime.year && <span>• {anime.year}</span>}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
