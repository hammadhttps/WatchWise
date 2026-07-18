import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Bookmark, Heart, Sparkles, Film, X, ChevronDown, Star, Clock, Flame } from 'lucide-react';
import TasteSection from '../components/profile/TasteSection';
import useAuth from '../hooks/useAuth';
import useLikes from '../hooks/useLikes';
import useWatchlist from '../hooks/useWatchlist';
import useAIHistory from '../hooks/useAIHistory';
import type { AIRecommendation } from '../services/api';
import { searchMovie } from '../services/tmdb';
import Footer from '../components/navigations/Footer';

type Tab = 'watchlist' | 'liked' | 'history' | 'taste';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { likedMovies, toggleLike } = useLikes();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialTab = (searchParams.get('tab') as Tab) || 'watchlist';
  const [tab, setTab] = useState<Tab>(['watchlist', 'liked', 'history', 'taste'].includes(initialTab) ? initialTab : 'watchlist');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { history, isLoading: historyLoading } = useAIHistory();

  useEffect(() => {
    if (!loading && !user) navigate('/sign');
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const openRecommendation = async (rec: AIRecommendation) => {
    try {
      const search = await searchMovie(rec.title, rec.year);
      const hit = search.results?.[0];
      if (hit) navigate(`/movie/${hit.id}`);
    } catch {
      // movie page unavailable — stay on profile
    }
  };

  const tabs: { id: Tab; label: string; Icon: typeof Bookmark; count: number }[] = [
    { id: 'watchlist', label: 'Watchlist', Icon: Bookmark, count: watchlist.length },
    { id: 'liked', label: 'Liked', Icon: Heart, count: likedMovies.length },
    { id: 'history', label: 'AI History', Icon: Sparkles, count: history.length },
    { id: 'taste', label: 'Taste', Icon: Flame, count: likedMovies.length },
  ];
  const statTiles = tabs.slice(0, 3);

  const scoreColor = (score: number) =>
    score >= 90 ? 'text-green-400' : score >= 80 ? 'text-[#6ea8fe]' : 'text-yellow-400';

  const movieGrid = (
    movies: { tmdbId: number; title: string; posterPath: string | null; genres: string[] }[],
    onRemove: (m: { tmdbId: number; title: string }) => void,
    emptyIcon: typeof Bookmark,
    emptyText: string,
    emptyHint: string
  ) => {
    const EmptyIcon = emptyIcon;
    if (movies.length === 0) {
      return (
        <div className="py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-4">
            <EmptyIcon size={22} className="text-white/30" />
          </div>
          <p className="text-[15px] font-semibold text-white/70 mb-1.5">{emptyText}</p>
          <p className="text-[13px] text-white/35 mb-5">{emptyHint}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-[#134686] text-[13.5px] font-bold py-2.5 px-5 rounded-lg hover:bg-[#ddeaff] transition-all"
          >
            Browse Movies
          </Link>
        </div>
      );
    }

    return (
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
        {movies.map(movie => (
          <div
            key={movie.tmdbId}
            onClick={() => navigate(`/movie/${movie.tmdbId}`)}
            className="group relative rounded-[10px] overflow-hidden bg-[#112055] border border-white/[0.07] hover:border-[#6ea8fe]/35 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="relative w-full aspect-[2/3] overflow-hidden">
              {movie.posterPath ? (
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0d1b3e]">
                  <Film size={24} className="text-white/25" />
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(movie); }}
                title="Remove"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white/70 opacity-0 group-hover:opacity-100 hover:bg-red-500/40 hover:border-red-400/50 hover:text-white transition-all cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
            <div className="p-2.5">
              <h3 className="text-[13px] font-bold text-white leading-tight line-clamp-2">{movie.title}</h3>
              {movie.genres.length > 0 && (
                <p className="text-[10.5px] text-white/35 mt-1 line-clamp-1">{movie.genres.slice(0, 2).join(' · ')}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-16 min-h-screen bg-[#0d1b3e]">
      <div className="relative px-[4%] pt-12 pb-16 overflow-hidden">

        <div className="absolute w-[360px] h-[360px] rounded-full bg-[#134686]/35 -top-16 -right-16 blur-[80px] pointer-events-none" />
        <div className="absolute w-[260px] h-[260px] rounded-full bg-[#6ea8fe]/08 top-40 -left-10 blur-[80px] pointer-events-none" />

        {/* ── Header ── */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-full bg-[#6ea8fe] flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(110,168,254,0.35)]">
            <span className="text-[32px] font-black text-[#134686]">
              {user.firstName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-[28px] font-bold text-white leading-tight">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-[14px] text-white/45">{user.email}</p>
            {user.createdAt && (
              <p className="flex items-center gap-1.5 text-[12px] text-white/35 mt-1.5">
                <Clock size={12} />
                Member since {formatDate(user.createdAt)}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {statTiles.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="px-4 py-3 bg-[#112055]/55 border border-white/[0.08] rounded-xl text-center cursor-pointer hover:border-[#6ea8fe]/35 transition-all min-w-[84px]"
              >
                <p className="text-[22px] font-black text-white leading-none">{count}</p>
                <p className="text-[11px] font-semibold text-white/40 uppercase tracking-[.5px] mt-1.5">{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="relative z-10 flex gap-2 mb-7 border-b border-white/[0.08] pb-0">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold rounded-t-lg border-b-2 transition-all cursor-pointer ${
                tab === id
                  ? 'text-white border-[#6ea8fe] bg-white/[0.04]'
                  : 'text-white/45 border-transparent hover:text-white/80'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="relative z-10">
          {tab === 'watchlist' && movieGrid(
            watchlist,
            (m) => toggleWatchlist(m),
            Bookmark,
            'Your watchlist is empty',
            'Tap the bookmark on any movie to save it for later'
          )}

          {tab === 'liked' && movieGrid(
            likedMovies,
            (m) => toggleLike(m),
            Heart,
            'No liked movies yet',
            'Tap the heart on movies you love — it powers your AI matches'
          )}

          {tab === 'taste' && <TasteSection likedMovies={likedMovies} />}

          {tab === 'history' && (
            historyLoading ? (
              <div className="py-16 text-center text-white/40 text-[14px]">Loading your AI history...</div>
            ) : history.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={22} className="text-white/30" />
                </div>
                <p className="text-[15px] font-semibold text-white/70 mb-1.5">No AI matches yet</p>
                <p className="text-[13px] text-white/35">Use ✨ AI Movie Match in the navbar — every session is saved here</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-w-[760px]">
                {history.map(entry => {
                  const expanded = expandedId === entry._id;
                  const prefs = entry.preferences;
                  const chips = [prefs.mood, prefs.company, prefs.era, ...(prefs.genres || [])].filter(Boolean);
                  return (
                    <div key={entry._id} className="bg-[#112055]/55 border border-white/[0.08] rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedId(expanded ? null : entry._id)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={13} className="text-[#6ea8fe] flex-shrink-0" />
                            <span className="text-[13.5px] font-bold text-white">{formatDate(entry.createdAt)}</span>
                            <span className="text-[11.5px] text-white/35">· {entry.recommendations.length} picks</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {chips.length > 0 ? chips.map((c, i) => (
                              <span key={`${c}-${i}`} className="text-[10.5px] font-semibold text-[#6ea8fe]/80 bg-[#6ea8fe]/10 px-2 py-[2px] rounded">
                                {c}
                              </span>
                            )) : (
                              <span className="text-[11px] text-white/30">No filters — open match</span>
                            )}
                          </div>
                        </div>
                        <ChevronDown size={16} className={`text-white/40 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                      </button>

                      {expanded && (
                        <div className="px-5 pb-4 border-t border-white/[0.06]">
                          {prefs.note && (
                            <p className="text-[12px] text-white/40 italic mt-3 mb-1">"{prefs.note}"</p>
                          )}
                          <div className="flex flex-col gap-2 mt-3">
                            {entry.recommendations.map((rec, index) => (
                              <div
                                key={`${rec.title}-${index}`}
                                onClick={() => openRecommendation(rec)}
                                className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg cursor-pointer hover:border-[#6ea8fe]/35 hover:bg-white/[0.06] transition-all"
                              >
                                <div className="min-w-0">
                                  <p className="text-[13.5px] font-bold text-white leading-tight">
                                    {rec.title} {rec.year && <span className="font-medium text-white/35 text-[12px]">({rec.year})</span>}
                                  </p>
                                  <p className="text-[11.5px] text-white/40 line-clamp-1 mt-0.5">{rec.reason}</p>
                                </div>
                                <span className={`flex items-center gap-1 flex-shrink-0 text-[12px] font-bold ${scoreColor(rec.matchScore)}`}>
                                  <Star size={10} fill="currentColor" stroke="none" />
                                  {rec.matchScore}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
