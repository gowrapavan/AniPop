import React from 'react';
import { motion } from 'framer-motion';

interface LangToggleProps {
  currentLang: 'sub' | 'dub';
  onToggle: (lang: 'sub' | 'dub') => void;
  className?: string;
}

export function LangToggle({ currentLang, onToggle, className = '' }: LangToggleProps) {
  return (
    <div className={`flex bg-gray-700/50 rounded-xl p-1 ${className}`}>
      {(['sub', 'dub'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => onToggle(lang)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            currentLang === lang
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {currentLang === lang && (
            <motion.div
              layoutId="lang-toggle-bg"
              className="absolute inset-0 bg-blue-600 rounded-lg"
              initial={false}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{lang.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}