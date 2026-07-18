import { Play } from 'lucide-react';
import type { Video } from '../../types/movieDetails';

interface MovieMediaProps {
  videos: Video[];
  onSelectTrailer?: (video: Video) => void;
}

const MovieMedia = ({ videos, onSelectTrailer }: MovieMediaProps) => {
  if (!videos || videos.length === 0) {
    return <p className="text-[14px] text-white/35 py-4">No media available yet.</p>;
  }

  const trailers = videos.filter((video) => video.site === 'YouTube' && video.key);

  if (trailers.length === 0) {
    return <p className="text-[14px] text-white/35 py-4">No trailers available yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {trailers.slice(0, 4).map((v, i) => (
        <button
          key={v.id || i}
          type="button"
          onClick={() => onSelectTrailer?.(v)}
          className="text-left bg-white/[0.04] rounded-xl p-4 border border-white/[0.08] transition hover:bg-white/[0.08]"
        >
          <div className="aspect-video bg-white/[0.05] rounded-lg mb-2 flex items-center justify-center relative overflow-hidden group cursor-pointer">
            <Play size={24} className="text-white/30 group-hover:scale-110 transition-transform" />
            <img
              src={`https://img.youtube.com/vi/${v.key}/mqdefault.jpg`}
              alt={v.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
            />
          </div>
          <p className="text-[12px] text-white/70 font-medium">{v.type}</p>
          <p className="text-[11px] text-white/35">{v.name}</p>
        </button>
      ))}
    </div>
  );
};

export default MovieMedia;
