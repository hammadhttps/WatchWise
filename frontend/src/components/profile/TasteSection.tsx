import { useMutation } from '@tanstack/react-query';
import { Flame, Sparkles, Loader2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tasteAPI } from '../../services/api';
import type { LikedMovie } from '../../services/api';

const TasteSection = ({ likedMovies }: { likedMovies: LikedMovie[] }) => {
  const roastMutation = useMutation({
    mutationFn: () => tasteAPI.getRoast()
  });

  if (likedMovies.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Flame size={22} className="text-white/30" />
        </div>
        <p className="text-[15px] font-semibold text-white/70 mb-1.5">No taste data yet</p>
        <p className="text-[13px] text-white/35 mb-5">Like a few movies and your taste profile builds itself</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-white text-[#134686] text-[13.5px] font-bold py-2.5 px-5 rounded-lg hover:bg-[#ddeaff] transition-all">
          Browse Movies
        </Link>
      </div>
    );
  }

  const genreCounts = new Map<string, number>();
  const decadeCounts = new Map<string, number>();
  for (const movie of likedMovies) {
    for (const genre of movie.genres || []) {
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
    }
    if (movie.year) {
      const decade = `${Math.floor(movie.year / 10) * 10}s`;
      decadeCounts.set(decade, (decadeCounts.get(decade) || 0) + 1);
    }
  }

  const topGenres = [...genreCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxGenre = topGenres[0]?.[1] || 1;
  const decades = [...decadeCounts.entries()].sort((a, b) => b[1] - a[1]);

  const roastError =
    roastMutation.error && typeof roastMutation.error === 'object' && 'response' in roastMutation.error
      ? (roastMutation.error as { response?: { data?: { message?: string } } }).response?.data?.message
      : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2 max-w-[980px]">
      {/* Genre breakdown */}
      <div className="bg-[#112055]/55 border border-white/[0.08] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Heart size={14} className="text-red-400" fill="#f87171" />
          <h3 className="text-[14px] font-bold text-white">Your genres</h3>
          <span className="text-[11.5px] text-white/35">from {likedMovies.length} liked movie{likedMovies.length > 1 ? 's' : ''}</span>
        </div>
        <div className="flex flex-col gap-3" role="list" aria-label="Liked genres by count">
          {topGenres.map(([genre, count]) => (
            <div key={genre} role="listitem" className="flex items-center gap-3">
              <span className="w-[110px] flex-shrink-0 text-[12.5px] font-semibold text-white/70 truncate">{genre}</span>
              <div className="flex-1 h-[10px] bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#134686] to-[#6ea8fe] rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxGenre) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-[12px] font-bold text-white/50">{count}</span>
            </div>
          ))}
        </div>

        {decades.length > 0 && (
          <>
            <h3 className="text-[14px] font-bold text-white mt-7 mb-3.5">Your decades</h3>
            <div className="flex flex-wrap gap-2">
              {decades.map(([decade, count]) => (
                <span key={decade} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6ea8fe]/10 border border-[#6ea8fe]/25 rounded-full text-[12.5px] font-semibold text-[#6ea8fe]">
                  {decade}
                  <span className="text-[11px] text-white/40">×{count}</span>
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* AI roast */}
      <div className="bg-[#112055]/55 border border-white/[0.08] rounded-xl p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Flame size={15} className="text-orange-400" />
          <h3 className="text-[14px] font-bold text-white">The Critic's Verdict</h3>
        </div>
        <p className="text-[12.5px] text-white/40 mb-5">Gemini reads your likes and says what it really thinks.</p>

        {roastMutation.data ? (
          <>
            <blockquote className="flex-1 text-[14px] text-white/75 leading-[1.75] italic border-l-2 border-orange-400/50 pl-4">
              {roastMutation.data.roast}
            </blockquote>
            <button
              onClick={() => roastMutation.mutate()}
              disabled={roastMutation.isPending}
              className="mt-5 self-start flex items-center gap-2 text-[12.5px] font-semibold text-[#6ea8fe] bg-[#6ea8fe]/10 border border-[#6ea8fe]/25 px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#6ea8fe]/20 transition-all disabled:opacity-50"
            >
              {roastMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
              Roast me again
            </button>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            {roastError && <p className="text-[13px] text-red-400 mb-4 text-center">{roastError}</p>}
            <button
              onClick={() => roastMutation.mutate()}
              disabled={roastMutation.isPending}
              className="flex items-center gap-2 bg-white text-[#134686] text-[14px] font-bold py-2.5 px-6 rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all disabled:opacity-60"
            >
              {roastMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Flame size={15} />}
              {roastMutation.isPending ? 'Judging you...' : 'Roast my taste'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasteSection;
