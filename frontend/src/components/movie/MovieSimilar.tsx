import { Play } from 'lucide-react';
import type { Movie } from '../../types/movieDetails';
import { Link } from 'react-router-dom';

interface MovieSimilarProps {
  movies: Movie[];
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3.5">
    <div className="w-[18px] h-[2px] bg-[#6ea8fe] rounded-full" />
    <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#6ea8fe]">{children}</span>
  </div>
);

const MovieSimilar = ({ movies }: MovieSimilarProps) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#112055]/60 border border-white/[0.08] rounded-xl p-5 mb-4">
      <SectionLabel>You May Also Like</SectionLabel>
      <div className="grid grid-cols-3 gap-3">
        {movies.slice(0, 3).map(m => (
          <div key={m.id} className="cursor-pointer group">
            <Link to={`/movie/${m.id}`}>
            <div
              className="aspect-[2/3] rounded-lg mb-1.5 flex items-center justify-center overflow-hidden group-hover:-translate-y-0.5 transition-transform"
              style={{ background: 'linear-gradient(135deg,#1a3a6e,#091630)' }}
            >
              {m.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                  alt={m.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Play size={16} color="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.3)" stroke="none" />
              )}
            </div>
            <p className="text-[12px] font-semibold text-white/75 leading-[1.3] line-clamp-1">{m.title}</p>
            <p className="text-[11px] text-white/35">{m.release_date?.split('-')[0]}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSimilar;
