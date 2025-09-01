// src/components/CommentsPanel.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, Reply, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/Button';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      name: 'AnimeOtaku',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=50&h=50&fit=crop&crop=face',
      badge: 'VIP',
    },
    content:
      'This episode was absolutely incredible! The animation quality keeps getting better.',
    timestamp: '2 hours ago',
    likes: 24,
    replies: [
      {
        id: '1-1',
        user: {
          name: 'MangaReader',
          avatar:
            'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=50&h=50&fit=crop&crop=face',
        },
        content: 'Totally agree! The fight scenes were amazing.',
        timestamp: '1 hour ago',
        likes: 8,
      },
    ],
  },
  {
    id: '2',
    user: {
      name: 'TokyoFan',
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=50&h=50&fit=crop&crop=face',
    },
    content: "Can't wait for the next episode! This cliffhanger is killing me.",
    timestamp: '3 hours ago',
    likes: 15,
  },
];

interface CommentsPanelProps {
  className?: string;
}

export function CommentsPanel({ className = '' }: CommentsPanelProps) {
  const [activeTab, setActiveTab] = useState<'newest' | 'top'>('newest');
  const [comments] = useState(mockComments);

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment;
    isReply?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isReply ? 'ml-10 border-l border-gray-700 pl-4' : ''} py-3`}
    >
      <div className="flex gap-3">
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-600"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">
              {comment.user.name}
            </span>
            {comment.user.badge && (
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                {comment.user.badge}
              </span>
            )}
            <span className="text-gray-400 text-xs">{comment.timestamp}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-2">
            {comment.content}
          </p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="text-xs">{comment.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
              <Reply className="w-3.5 h-3.5" />
              <span className="text-xs">Reply</span>
            </button>
            <button className="text-gray-400 hover:text-gray-300 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {comment.replies &&
        comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
    </motion.div>
  );

  return (
    <div
      className={`bg-[#1a1a1a] rounded-2xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold text-lg">Trending Posts</h3>
        </div>
        <div className="flex gap-2">
          {['newest', 'top'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'newest' | 'top')}
              className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab === 'newest' ? 'Newest' : 'Top'}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-2">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>

      {/* Add Comment */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/40">
        <div className="flex gap-3">
          <img
            src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?w=50&h=50&fit=crop&crop=face"
            alt="Your avatar"
            className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-600"
          />
          <div className="flex-1">
            <textarea
              placeholder="Share your thoughts..."
              className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors"
              rows={2}
            />
            <div className="flex justify-between items-center mt-2">
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                View more →
              </button>
              <Button size="sm" variant="primary">
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
