import { Play, Bookmark, Volume2, Star } from 'lucide-react';
interface HeroProps {
  heroImage?: string;
  title?: string;
  description?: string;
  year?: string;
  duration?: string;
  genre?: string;
  rating?: string;
}
const HeroSection = ({  
  heroImage,
  title,
  description,
  year,
  duration = "2h 49m",
  genre = "Action · Adventure · Thriller",
  rating,
}: HeroProps) => {
  return (
    <div className="mt-17 relative w-full min-h-[520px] lg:min-h-[620px] bg-[#0d1b3e] overflow-hidden flex items-end">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="hero-section"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Left-to-right dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(13,27,62,0.97) 0%, rgba(13,27,62,0.85) 35%, rgba(13,27,62,0.3) 65%, rgba(13,27,62,0.05) 100%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44"
        style={{ background: 'linear-gradient(to top, rgba(13,27,62,1) 0%, transparent 100%)' }}
      />
      {/* Content */}
      <div className="relative z-10 px-[4%] pb-12 max-w-[560px]">
        {/* Now Streaming badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/85 text-[11px] font-semibold tracking-[1.4px] uppercase px-3 py-1 rounded-[4px] mb-5">
          <span className="w-1.5 h-1.5 bg-[#6ea8fe] rounded-full" />
          Now Streaming
        </div>
        {/* Meta row */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <span className="flex items-center gap-1 bg-white/10 text-white/75 text-[12px] font-medium px-2 py-0.5 rounded-[4px]">
            <Star size={11} fill="#facc15" stroke="none" />
            {rating}
          </span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span className="text-[12px] text-white/55 font-medium">{year}</span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span className="text-[12px] text-white/55 font-medium">{duration}</span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span className="text-[12px] text-white/55 font-medium">{genre}</span>
        </div>
        {/* Title */}
        <h1 className="text-[clamp(32px,5vw,54px)] font-bold text-white leading-[1.05] tracking-[-0.5px] mb-3.5">
          {title?.split(' ').map((word, i) =>
            i === 1 ? (
              <em key={i} className="not-italic text-[#6ea8fe]">{word} </em>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </h1>
        {/* Description */}
        <p className="text-[14px] text-white/55 leading-[1.7] mb-7 max-w-[420px]">
          {description}
        </p>
        {/* Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button className="flex items-center gap-2 bg-white text-[#134686] border-none px-6 py-3 text-[14px] font-bold rounded-md cursor-pointer hover:bg-[#e8f0ff] active:scale-[0.98] transition-all whitespace-nowrap">
            <Play size={16} fill="#134686" stroke="none" />
            Watch Now
          </button>
          <button className="flex items-center gap-2 bg-white/10 text-white border border-white/25 px-6 py-[11px] text-[14px] font-semibold rounded-md cursor-pointer hover:bg-white/20 hover:border-white/40 active:scale-[0.98] transition-all whitespace-nowrap">
            <Bookmark size={16} />
            Save for Later
          </button>
        </div>
        {/* Quality badges */}
        <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/10">
          {[
            { num: '4K', label: 'Ultra HD' },
            { num: 'HDR', label: 'Dolby Vision' },
            { num: '5.1', label: 'Surround' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              {i > 0 && <div className="w-px h-7 bg-white/12" />}
              <div className="text-center">
                <div className="text-[18px] font-bold text-white">{item.num}</div>
                <div className="text-[11px] text-white/40 tracking-[0.5px] mt-0.5">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Mute button — bottom right */}
      <div className="absolute right-[4%] bottom-12 z-10">
        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white/80 cursor-pointer hover:bg-white/20 transition-all">
          <Volume2 size={16} />
        </button>
      </div>
    </div>
  );
};
export default HeroSection