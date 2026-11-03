import React, { useState } from 'react';
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Plus,
  Flame,
  Sparkles,
} from 'lucide-react';

interface ViewSyncSocialFeedProps {
  userName?: string;
}

export const ViewSyncSocialFeed: React.FC<ViewSyncSocialFeedProps> = ({ userName = 'You' }) => {
  const [likedPosts, setLikedPosts] = useState<{ [id: string]: boolean }>({
    post1: false,
    post2: true,
  });
  const [likeCounts, setLikeCounts] = useState<{ [id: string]: number }>({
    post1: 12540,
    post2: 8920,
  });

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      setLikeCounts((c) => ({
        ...c,
        [postId]: isLiked ? c[postId] + 1 : c[postId] - 1,
      }));
      return { ...prev, [postId]: isLiked };
    });
  };

  const stories = [
    { id: 'your_story', label: 'Your Story', isUser: true, ringColor: 'from-blue-500 to-indigo-500' },
    { id: 'friends', label: 'Friends', ringColor: 'from-amber-400 to-rose-500' },
    { id: 'gaming', label: 'Gaming', ringColor: 'from-emerald-400 to-cyan-500' },
    { id: 'fun', label: 'Fun', ringColor: 'from-fuchsia-500 to-purple-500' },
    { id: 'family', label: 'Family', ringColor: 'from-orange-400 to-amber-500' },
  ];

  return (
    <div className="space-y-4 select-none pb-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-xl font-black text-white tracking-tight">Social Feed</h2>
        <button
          type="button"
          className="p-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition active:scale-95"
          title="Search Feed"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Stories Carousel matching Mockup */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
            <div
              className={`w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr ${story.ringColor} shadow-md group-hover:scale-105 transition`}
            >
              <div className="w-full h-full rounded-full bg-slate-900 border-2 border-slate-950 flex items-center justify-center relative overflow-hidden">
                {story.isUser ? (
                  <div className="w-full h-full bg-indigo-900/60 flex items-center justify-center">
                    <span className="text-xs font-bold text-white truncate max-w-[48px] px-0.5">
                      {userName ? userName.split(' ')[0] : 'You'}
                    </span>
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold border border-slate-950">
                      +
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-purple-800 flex items-center justify-center text-lg">
                    {story.id === 'friends' && '🎮'}
                    {story.id === 'gaming' && '👾'}
                    {story.id === 'fun' && '🎉'}
                    {story.id === 'family' && '🛡️'}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[11px] font-bold text-indigo-200/90 tracking-tight">
              {story.label}
            </span>
          </div>
        ))}
      </div>

      {/* Feed Post 1: Riya_Queen 💕 matching mockup */}
      <div className="rounded-3xl bg-white/5 border border-white/10 p-4 text-white space-y-3 shadow-xl backdrop-blur-md">
        {/* Post Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-indigo-950 flex items-center justify-center font-bold text-xs">
                RQ
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white">Riya_Queen</span>
                <span className="text-xs">💕</span>
              </div>
              <span className="text-[10px] text-indigo-300 font-medium">2h ago</span>
            </div>
          </div>

          <button type="button" className="text-slate-400 hover:text-white p-1">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Caption */}
        <p className="text-sm font-bold text-indigo-100 flex items-center gap-1.5">
          <span>Best Game Ever!</span>
          <span>🎮❤️</span>
        </p>

        {/* Rich Cyberpunk Gaming Illustration matching mockup */}
        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-indigo-950 via-purple-950 to-blue-950 relative overflow-hidden border border-indigo-500/30 flex items-center justify-center shadow-lg">
          {/* Cyberpunk Neon Circles */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-600/30 via-indigo-900/40 to-transparent" />
          
          <svg viewBox="0 0 200 160" className="w-full h-full relative z-10">
            {/* Glowing neon rings */}
            <circle cx="100" cy="80" r="60" stroke="#38BDF8" strokeWidth="2" strokeDasharray="6 4" fill="none" opacity="0.6" />
            <circle cx="100" cy="80" r="45" stroke="#EC4899" strokeWidth="3" fill="none" opacity="0.7" />
            
            {/* Hoodie Character with Neon X Eyes */}
            <path d="M50 160 C50 120 70 110 100 110 C130 110 150 120 150 160 Z" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2" />
            <circle cx="100" cy="80" r="30" fill="#0F172A" stroke="#A855F7" strokeWidth="3" />
            {/* Mask */}
            <rect x="80" y="72" width="40" height="25" rx="6" fill="#020617" />
            {/* Neon X Eyes */}
            <line x1="86" y1="78" x2="94" y2="86" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" />
            <line x1="94" y1="78" x2="86" y2="86" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" />
            
            <line x1="106" y1="78" x2="114" y2="86" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
            <line x1="114" y1="78" x2="106" y2="86" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
            
            {/* Neon mouth stitches */}
            <line x1="88" y1="92" x2="112" y2="92" stroke="#A855F7" strokeWidth="2" />
          </svg>
        </div>

        {/* Engagement Action Bar */}
        <div className="flex items-center justify-between pt-1 text-xs text-indigo-200">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => toggleLike('post1')}
              className={`flex items-center gap-1.5 font-bold transition active:scale-125 ${
                likedPosts.post1 ? 'text-rose-500' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${likedPosts.post1 ? 'fill-rose-500' : ''}`} />
              <span>{(likeCounts.post1 / 1000).toFixed(1)}K</span>
            </button>

            <button type="button" className="flex items-center gap-1.5 font-bold hover:text-white transition">
              <MessageCircle className="w-4 h-4 text-slate-300" />
              <span>654</span>
            </button>

            <button type="button" className="flex items-center gap-1.5 font-bold hover:text-white transition">
              <Share2 className="w-4 h-4 text-slate-300" />
              <span>321</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feed Post 2: GameStar123 */}
      <div className="rounded-3xl bg-white/5 border border-white/10 p-4 text-white space-y-2.5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-0.5">
              <div className="w-full h-full rounded-full bg-indigo-950 flex items-center justify-center font-bold text-xs">
                GS
              </div>
            </div>
            <div>
              <span className="text-xs font-extrabold text-white">GameStar123</span>
              <span className="text-[10px] text-indigo-300 font-medium block">3h ago</span>
            </div>
          </div>
          <button type="button" className="text-slate-400 hover:text-white p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-bold text-indigo-100 flex items-center gap-1">
          <span>New Update is Awesome!</span>
          <span>🚀</span>
        </p>
      </div>
    </div>
  );
};
