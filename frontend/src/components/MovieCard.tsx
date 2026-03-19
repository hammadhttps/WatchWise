import { Bell, Play, Star, Film } from 'lucide-react';


interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  };
}
const MovieCard = ({ movie }: MovieCardProps) => {
  const badge = 'soon';
  
  const badgeStyles: Record<string, string> = {
    soon: 'bg-[#134686]/90 text-[#6ea8fe] border border-[#6ea8fe]/30',
  };
  const badgeLabel: Record<string, string> = {
    soon: 'Coming Soon',
  };
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  return (
    <div className="group relative rounded-[10px] overflow-hidden bg-[#112055] border border-white/[0.07] hover:border-[#6ea8fe]/35 hover:-translate-y-[5px] transition-all duration-200 flex flex-col cursor-pointer">
      <div className="relative w-full aspect-[2/3] overflow-hidden flex-shrink-0">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#0d1b3e]">
            <div className="w-12 h-12 rounded-full bg-white/[0.07] flex items-center justify-center">
              <Film size={22} color="rgba(255,255,255,0.4)" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-1.5 w-20">
              <div className="h-[7px] rounded-[3px] bg-white/10 w-full" />
              <div className="h-[7px] rounded-[3px] bg-white/10 w-14" />
            </div>
          </div>
        )}
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold tracking-[0.8px] uppercase px-2 py-[3px] rounded-[4px] ${badgeStyles[badge]}`}>
          {badgeLabel[badge]}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b3e] via-[#0d1b3e]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play size={18} fill="#134686" stroke="none" />
          </div>
        </div>
      </div>
      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] text-white/35 font-medium">{movie.release_date?.split('-')[0]}</span>
        <h3 className="text-[15px] font-bold text-white leading-[1.25] line-clamp-2">{movie.title}</h3>
        <p className="text-[12px] text-white/45 leading-[1.6] line-clamp-2 flex-1">{movie.overview}</p>
        <div className="flex items-center justify-between mt-2.5">
          <span className="flex items-center gap-1 text-[12px] font-semibold text-yellow-400">
            <Star size={11} fill="#facc15" stroke="none" />
            {movie.vote_average?.toFixed(1)}
          </span>
          <span className="text-[11px] font-semibold text-[#6ea8fe]/80 bg-[#6ea8fe]/10 px-2 py-[2px] rounded-[4px]">
            {formatDate(movie.release_date)}
          </span>
        </div>
        <button className="w-full mt-2.5 py-2 bg-[#6ea8fe]/[0.08] border border-[#6ea8fe]/20 rounded-md text-[#6ea8fe] text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#6ea8fe]/[0.16] hover:border-[#6ea8fe]/40 transition-all cursor-pointer">
          <Bell size={13} />
          Notify Me
        </button>
      </div>
    </div>
  );
};

export default MovieCard;