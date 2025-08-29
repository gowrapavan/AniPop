import React, { useState } from 'react';
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
    <div
      className={`${
        isReply ? 'ml-8 border-l-2 border-gray-700 pl-4' : ''
      } py-3`}
    >
      <div className="flex gap-3">
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">
              {comment.user.name}
            </span>
            {comment.user.badge && (
              <span className="bg-yellow-600 text-black text-xs px-2 py-0.5 rounded-full font-bold">
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
              <ThumbsUp className="w-3 h-3" />
              <span className="text-xs">{comment.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
              <Reply className="w-3 h-3" />
              <span className="text-xs">Reply</span>
            </button>
            <button className="text-gray-400 hover:text-gray-300 transition-colors">
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      {comment.replies &&
        comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
    </div>
  );

  return (
    <div className={`bg-[#1a1a1a] rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-4 mb-3">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Trending Posts</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('newest')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === 'newest'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Newest Comments
          </button>
          <button
            onClick={() => setActiveTab('top')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === 'top'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Top Comments
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-1">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>

      {/* Add Comment */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-3">
          <img
            src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?w=50&h=50&fit=crop&crop=face"
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              placeholder="Share your thoughts..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors"
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
