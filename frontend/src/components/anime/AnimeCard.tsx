import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Movie } from '../../types/movie';

interface AnimeCardProps {
  anime: Movie;
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const posterUrl = anime.poster_path ? `https://image.tmdb.org/t/p/w500${anime.poster_path}` : undefined;

  return (
    <Link to={`/movie/${anime.id}`} className="group block overflow-hidden rounded-[18px] bg-[#112055] border border-white/[0.08] shadow-sm transition-all hover:-translate-y-1 hover:border-[#6ea8fe]/30">
      <div className="relative h-[300px] overflow-hidden bg-[#08112a]">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={anime.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#0d1b3e] text-white/40">
            No Image
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-[12px] uppercase tracking-[1px] text-white/70">{anime.release_date?.split('-')[0] ?? 'TBA'}</p>
          <h3 className="mt-2 text-[16px] font-semibold text-white leading-[1.2] line-clamp-2">{anime.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 text-[13px] text-white/70">
          <span>{anime.vote_average?.toFixed(1) ?? '—'}</span>
          <span className="flex items-center gap-1 text-yellow-400">
            <Star size={14} fill="#facc15" stroke="none" />
          </span>
        </div>
        <p className="mt-3 text-[13px] leading-[1.65] text-white/60 line-clamp-3">{anime.overview ?? 'No overview available.'}</p>
      </div>
    </Link>
  );
};

export default AnimeCard;
