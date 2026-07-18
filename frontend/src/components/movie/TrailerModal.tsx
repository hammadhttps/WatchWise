import { X } from 'lucide-react';
import type { Video } from '../../types/movieDetails';

interface TrailerModalProps {
  video: Video | null;
  onClose: () => void;
}

const TrailerModal = ({ video, onClose }: TrailerModalProps) => {
  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-2xl border border-white/10 bg-[#07152a] p-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-3 py-2 text-white/80">
          <div>
            <p className="text-sm font-semibold">{video.name}</p>
            <p className="text-xs text-white/45">{video.type}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close trailer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="aspect-video overflow-hidden rounded-xl">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1`}
            title={video.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
