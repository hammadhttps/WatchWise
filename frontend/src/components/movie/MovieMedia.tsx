import { Play } from 'lucide-react';
import type { Video } from '../../types/movieDetails';

interface MovieMediaProps {
  videos: Video[];
}

const MovieMedia = ({ videos }: MovieMediaProps) => {
  if (!videos || videos.length === 0) {
    return <p className="text-[14px] text-white/35 py-4">No media available yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {videos.slice(0, 4).map((v, i) => (
        <div key={v.id || i} className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.08]">
          <div className="aspect-video bg-white/[0.05] rounded-lg mb-2 flex items-center justify-center relative overflow-hidden group cursor-pointer">
            <Play size={24} className="text-white/30 group-hover:scale-110 transition-transform" />
            {v.site === 'YouTube' && v.key && (
              <img 
                src={`https://img.youtube.com/vi/${v.key}/mqdefault.jpg`}
                alt={v.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
            )}
          </div>
          <p className="text-[12px] text-white/70 font-medium">{v.type}</p>
          <p className="text-[11px] text-white/35">{v.name}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieMedia;
