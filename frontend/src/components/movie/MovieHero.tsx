import { Star, Film } from 'lucide-react';
import type { MovieDetails } from '../../types/movieDetails';

interface MovieHeroProps {
  details: MovieDetails;
  backdropUrl: string | null;
  posterUrl: string | null;
}

const MovieHero = ({ details, backdropUrl, posterUrl }: MovieHeroProps) => {
  const titleParts = details.title?.split(' ') || [];
  const firstWord = titleParts[0] || '';
  const restWords = titleParts.slice(1).join(' ');

  const formatRuntime = (mins: number | undefined) => {
    if (!mins) return 'N/A';
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="relative w-full h-[480px] lg:h-[520px] overflow-hidden">
      {backdropUrl ? (
        <img src={backdropUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f2347] via-[#091528] to-[#060e1c]">
          <span className="text-white/[0.05] font-black text-[clamp(80px,18vw,200px)] tracking-[-4px] select-none">
            WATCHWISE
          </span>
        </div>
      )}

      <div 
        className="absolute inset-0" 
        style={{ background: 'linear-gradient(90deg,rgba(13,27,62,1) 0%,rgba(13,27,62,.7) 45%,rgba(13,27,62,.15) 75%,transparent 100%)' }} 
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-56" 
        style={{ background: 'linear-gradient(to top,#0d1b3e 0%,transparent 100%)' }} 
      />

      <div className="absolute bottom-12 left-[4%] z-10 flex items-end gap-8 flex-wrap">
        <div className="flex-shrink-0 w-[140px] lg:w-[160px] aspect-[2/3] rounded-[10px] overflow-hidden border-2 border-white/12 bg-gradient-to-br from-[#1a3a6e] via-[#0e2247] to-[#091630] flex flex-col items-center justify-center gap-2.5">
          {posterUrl ? (
            <img src={posterUrl} alt={details.title} className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white/[0.08] flex items-center justify-center">
                <Film size={20} color="rgba(255,255,255,0.4)" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col gap-1.5 w-[70px]">
                <div className="h-1.5 rounded-[3px] bg-white/10 w-full" />
                <div className="h-1.5 rounded-[3px] bg-white/10 w-3/4" />
              </div>
            </>
          )}
        </div>

        <div className="pb-1">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {['4K UHD', ...(details.genres?.map(g => g.name) || [])].slice(0, 4).map((b, i) => (
              <span
                key={b}
                className={`text-[10px] font-bold tracking-[1px] uppercase px-2.5 py-[3px] rounded-[4px] border ${
                  i === 0
                    ? 'bg-[#6ea8fe]/15 text-[#6ea8fe] border-[#6ea8fe]/30'
                    : 'bg-white/[0.06] text-white/45 border-white/10'
                }`}
              >
                {b}
              </span>
            ))}
          </div>

          <h1 className="font-black text-[clamp(36px,6vw,68px)] leading-[0.95] tracking-[1px] mb-3">
            {firstWord}{' '}
            <em className="not-italic text-[#6ea8fe]">{restWords}</em>
          </h1>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/25 px-2 py-0.5 rounded-[4px]">
              <Star size={12} fill="#facc15" stroke="none" />
              <span className="text-[13px] font-bold text-yellow-400">{details.vote_average?.toFixed(1)}</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="w-[3px] h-[3px] bg-white/20 rounded-full" />
              <span className="text-[13px] text-white/50 font-medium">{details.release_date?.split('-')[0]}</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="w-[3px] h-[3px] bg-white/20 rounded-full" />
              <span className="text-[13px] text-white/50 font-medium">{formatRuntime(details.runtime)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
