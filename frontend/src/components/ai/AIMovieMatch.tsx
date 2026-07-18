import { useState, useEffect } from 'react';
import { X, Sparkles, Lock, Heart, Film, RefreshCw, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLikes from '../../hooks/useLikes';
import { useQueryClient } from '@tanstack/react-query';
import { aiAPI } from '../../services/api';
import type { AIRecommendation } from '../../services/api';
import { searchMovie } from '../../services/tmdb';

interface AIMovieMatchProps {
  open: boolean;
  onClose: () => void;
}

interface EnrichedRecommendation extends AIRecommendation {
  posterPath: string | null;
  tmdbId: number | null;
}

const MOODS = ['Feel-good', 'Thrilled', 'Mind-bending', 'Cozy', 'Dark & gritty', 'Romantic', 'Adventurous', 'Nostalgic'];
const COMPANY = ['Solo', 'Date night', 'Family', 'Friends'];
const ERAS = ['Any era', '2020s', '2010s', '2000s', '90s', 'Classics'];
const GENRES = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance', 'Fantasy', 'Mystery', 'Animation', 'Crime', 'Documentary'];

const LOADING_LINES = [
  'Reading your taste profile...',
  'Cross-referencing a century of cinema...',
  'Weighing tonight\'s mood...',
  'Curating your perfect lineup...',
];

const chipClass = (selected: boolean) =>
  `px-3.5 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-150 border ${
    selected
      ? 'bg-[#6ea8fe] text-[#0d1b3e] border-[#6ea8fe] shadow-[0_0_16px_rgba(110,168,254,0.35)]'
      : 'bg-white/[0.05] text-white/60 border-white/10 hover:border-[#6ea8fe]/40 hover:text-white'
  }`;

const AIMovieMatch = ({ open, onClose }: AIMovieMatchProps) => {
  const { user } = useAuth();
  const { likedMovies } = useLikes();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [phase, setPhase] = useState<'form' | 'loading' | 'results' | 'error'>('form');
  const [mood, setMood] = useState('');
  const [company, setCompany] = useState('');
  const [era, setEra] = useState('Any era');
  const [genres, setGenres] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [results, setResults] = useState<EnrichedRecommendation[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingLine, setLoadingLine] = useState(0);

  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => setLoadingLine(l => (l + 1) % LOADING_LINES.length), 1800);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const toggleGenre = (genre: string) => {
    setGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  const handleMatch = async () => {
    setPhase('loading');
    setLoadingLine(0);

    try {
      const { recommendations } = await aiAPI.getRecommendations({ mood, company, era, genres, note });

      const enriched: EnrichedRecommendation[] = await Promise.all(
        recommendations.map(async rec => {
          try {
            const search = await searchMovie(rec.title, rec.year);
            const hit = search.results?.[0];
            return { ...rec, posterPath: hit?.poster_path || null, tmdbId: hit?.id ?? null };
          } catch {
            return { ...rec, posterPath: null, tmdbId: null };
          }
        })
      );

      setResults(enriched);
      setPhase('results');
      queryClient.invalidateQueries({ queryKey: ['ai-history'] });
    } catch (err: unknown) {
      let message = 'Something went wrong. Please try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        message = axiosError.response?.data?.message || message;
      }
      setErrorMessage(message);
      setPhase('error');
    }
  };

  const handleOpenMovie = (rec: EnrichedRecommendation) => {
    if (!rec.tmdbId) return;
    onClose();
    navigate(`/movie/${rec.tmdbId}`);
  };

  const scoreColor = (score: number) =>
    score >= 90 ? 'text-green-400 border-green-400/40 bg-green-500/10'
    : score >= 80 ? 'text-[#6ea8fe] border-[#6ea8fe]/40 bg-[#6ea8fe]/10'
    : 'text-yellow-400 border-yellow-400/40 bg-yellow-500/10';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-[#050b1c]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[620px] max-h-[88vh] flex flex-col bg-[#0d1b3e] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute w-[280px] h-[280px] rounded-full bg-[#134686]/40 -top-20 -right-20 blur-[80px] pointer-events-none" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-[#6ea8fe]/10 -bottom-16 -left-16 blur-[70px] pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6ea8fe]/15 border border-[#6ea8fe]/30 flex items-center justify-center">
              <Sparkles size={15} color="#6ea8fe" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white leading-tight">AI Movie Match</h2>
              <p className="text-[11px] text-white/40">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="relative overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

          {/* ── Signed out ── */}
          {!user && (
            <div className="py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-[#6ea8fe]/10 border border-[#6ea8fe]/25 flex items-center justify-center mx-auto mb-5">
                <Lock size={26} color="#6ea8fe" />
              </div>
              <h3 className="text-[19px] font-bold text-white mb-2">Sign in to unlock AI matches</h3>
              <p className="text-[13.5px] text-white/45 max-w-[320px] mx-auto mb-6 leading-relaxed">
                AI Movie Match learns from the movies you like and finds your next favorite. Create a free account to get started.
              </p>
              <button
                onClick={() => { onClose(); navigate('/sign'); }}
                className="inline-flex items-center gap-2 bg-white text-[#134686] text-[14.5px] font-bold py-2.5 px-6 rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all"
              >
                Sign In
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* ── Preference form ── */}
          {user && phase === 'form' && (
            <div>
              <div className="flex items-center gap-2 mb-6 px-3.5 py-2.5 bg-[#6ea8fe]/[0.07] border border-[#6ea8fe]/20 rounded-lg">
                <Heart size={14} className="text-red-400 flex-shrink-0" fill={likedMovies.length ? '#f87171' : 'none'} />
                <p className="text-[12.5px] text-white/60">
                  {likedMovies.length > 0
                    ? <>Matching against <span className="text-white font-semibold">{likedMovies.length} movie{likedMovies.length > 1 ? 's' : ''}</span> you've liked</>
                    : <>Tip: tap the <span className="text-white font-semibold">heart</span> on movies you love — matches get smarter</>}
                </p>
              </div>

              <div className="mb-5">
                <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-2.5">What's the mood?</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(m => (
                    <button key={m} onClick={() => setMood(mood === m ? '' : m)} className={chipClass(mood === m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-2.5">Watching with</label>
                <div className="flex flex-wrap gap-2">
                  {COMPANY.map(c => (
                    <button key={c} onClick={() => setCompany(company === c ? '' : c)} className={chipClass(company === c)}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-2.5">Era</label>
                <div className="flex flex-wrap gap-2">
                  {ERAS.map(e => (
                    <button key={e} onClick={() => setEra(e)} className={chipClass(era === e)}>{e}</button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-2.5">
                  Genres <span className="normal-case font-medium text-white/30">(pick any)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => (
                    <button key={g} onClick={() => toggleGenre(g)} className={chipClass(genres.includes(g))}>{g}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[12px] font-bold tracking-[.4px] uppercase text-white/50 mb-2.5">
                  Anything else? <span className="normal-case font-medium text-white/30">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  maxLength={280}
                  rows={2}
                  placeholder='e.g. "something like Interstellar but lighter", "under 2 hours"...'
                  className="w-full bg-white/[0.05] border border-white/10 text-white text-[14px] px-3.5 py-[11px] rounded-lg outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 focus:bg-[#6ea8fe]/05 transition-all font-sans resize-none"
                />
              </div>

              <button
                onClick={handleMatch}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#134686] text-[15px] font-bold py-3 rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all"
              >
                <Sparkles size={16} strokeWidth={2.5} />
                Find My Matches
              </button>
            </div>
          )}

          {/* ── Loading ── */}
          {user && phase === 'loading' && (
            <div className="py-14 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-[#6ea8fe]/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6ea8fe] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film size={26} className="text-[#6ea8fe] animate-pulse" />
                </div>
              </div>
              <p className="text-[15px] font-semibold text-white mb-1.5">{LOADING_LINES[loadingLine]}</p>
              <p className="text-[12.5px] text-white/40">Gemini is picking 6 movies just for you</p>
            </div>
          )}

          {/* ── Results ── */}
          {user && phase === 'results' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[17px] font-bold text-white">Your matches, {user.firstName}</h3>
                  <p className="text-[12.5px] text-white/40 mt-0.5">Handpicked for {mood ? mood.toLowerCase() : 'tonight'}{company ? ` · ${company.toLowerCase()}` : ''} · saved to your profile</p>
                </div>
                <button
                  onClick={() => setPhase('form')}
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#6ea8fe] bg-[#6ea8fe]/10 border border-[#6ea8fe]/25 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#6ea8fe]/20 transition-all"
                >
                  <RefreshCw size={12} />
                  Refine
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {results.map((rec, index) => (
                  <div
                    key={`${rec.title}-${index}`}
                    onClick={() => handleOpenMovie(rec)}
                    className={`group flex gap-4 p-3 bg-white/[0.04] border border-white/[0.07] rounded-xl transition-all duration-200 ${
                      rec.tmdbId ? 'cursor-pointer hover:border-[#6ea8fe]/40 hover:bg-white/[0.07]' : ''
                    }`}
                  >
                    <div className="w-[72px] h-[108px] rounded-lg overflow-hidden flex-shrink-0 bg-[#112055]">
                      {rec.posterPath ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${rec.posterPath}`}
                          alt={rec.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film size={20} className="text-white/25" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 py-0.5">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className="text-[15px] font-bold text-white leading-tight">
                          {rec.title} {rec.year && <span className="font-medium text-white/35 text-[13px]">({rec.year})</span>}
                        </h4>
                        <span className={`flex items-center gap-1 flex-shrink-0 text-[12px] font-bold px-2 py-[3px] rounded-md border ${scoreColor(rec.matchScore)}`}>
                          <Star size={10} fill="currentColor" stroke="none" />
                          {rec.matchScore}%
                        </span>
                      </div>
                      {rec.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {rec.genres.map(g => (
                            <span key={g} className="text-[10.5px] font-semibold text-[#6ea8fe]/80 bg-[#6ea8fe]/10 px-1.5 py-[2px] rounded">
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[12.5px] text-white/50 leading-[1.55] line-clamp-3">{rec.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {user && phase === 'error' && (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
                <X size={22} className="text-red-400" />
              </div>
              <p className="text-[15px] font-semibold text-white mb-2">{errorMessage}</p>
              <button
                onClick={() => setPhase('form')}
                className="mt-4 inline-flex items-center gap-2 bg-white text-[#134686] text-[14px] font-bold py-2.5 px-5 rounded-lg cursor-pointer hover:bg-[#ddeaff] transition-all"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMovieMatch;
