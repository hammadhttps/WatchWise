import { Bell, Play, ArrowRight, Star, Film } from 'lucide-react';
import cardImage  from "../assets/cardImage.jpg"

interface Movie {
  id: number;
  name: string;
  desc: string;
  image: string | null;
  genre: string;
  year: string;
  rating: string;
  releaseDate: string;
  badge: 'soon' | 'new' | 'hot';
  gradient: string;
}

const UPCOMING_MOVIES: Movie[] = [
  {
    id: 1,
    name: 'Stellar Collapse',
    desc: 'When a dying star threatens to consume an entire solar system, one rogue physicist races against time to prevent galactic extinction.',
    image: cardImage,
    genre: 'Sci-Fi',
    year: '2025',
    rating: '9.1',
    releaseDate: 'Mar 28',
    badge: 'soon',
    gradient: 'linear-gradient(135deg,#1a3a6e 0%,#0e2247 50%,#091630 100%)',
  },
  {
    id: 2,
    name: 'The Last Borough',
    desc: 'A corrupt city mayor unravels a decades-old conspiracy that connects the highest offices of power to a string of disappearances.',
    image: cardImage,
    genre: 'Thriller',
    year: '2025',
    rating: '8.7',
    releaseDate: 'Apr 11',
    badge: 'hot',
    gradient: 'linear-gradient(135deg,#3d1a0e 0%,#1e0d07 50%,#110805 100%)',
  },
  {
    id: 3,
    name: 'Neon Requiem',
    desc: 'In a rain-soaked cyberpunk city, a retired assassin takes one final contract that forces her to confront her own ghost.',
    image: cardImage,
    genre: 'Action',
    year: '2025',
    rating: '8.4',
    releaseDate: 'Apr 25',
    badge: 'soon',
    gradient: 'linear-gradient(135deg,#0e1f3d 0%,#070f1e 50%,#030810 100%)',
  },
  {
    id: 4,
    name: 'Hollow Earth',
    desc: 'An underground expedition uncovers a living civilization beneath the ocean floor — and a secret that could rewrite human history.',
    image: cardImage,
    genre: 'Adventure',
    year: '2025',
    rating: '8.9',
    releaseDate: 'May 02',
    badge: 'new',
    gradient: 'linear-gradient(135deg,#0b2e1a 0%,#071a0f 50%,#040e08 100%)',
  },
  {
    id: 5,
    name: 'Fractured Time',
    desc: 'After an experiment tears through the fabric of time, a physicist must stitch together multiple timelines before reality collapses.',
    image: cardImage,
    genre: 'Sci-Fi',
    year: '2025',
    rating: '9.3',
    releaseDate: 'May 16',
    badge: 'hot',
    gradient: 'linear-gradient(135deg,#2a0e3d 0%,#150720 50%,#0a0412 100%)',
  },
  {
    id: 6,
    name: 'Desert Wind',
    desc: 'A young nomad crosses treacherous wastelands to deliver a message that will decide the fate of two warring desert clans.',
    image: cardImage,
    genre: 'Drama',
    year: '2025',
    rating: '8.2',
    releaseDate: 'Jun 06',
    badge: 'soon',
    gradient: 'linear-gradient(135deg,#3d2e0a 0%,#1e1705 50%,#100d03 100%)',
  },
];

const badgeStyles: Record<Movie['badge'], string> = {
  soon: 'bg-[#134686]/90 text-[#6ea8fe] border border-[#6ea8fe]/30',
  new:  'bg-[#10553c]/90 text-green-400 border border-green-400/30',
  hot:  'bg-[#782814]/90 text-orange-400 border border-orange-400/30',
};

const badgeLabel: Record<Movie['badge'], string> = {
  soon: 'Coming Soon',
  new:  'New',
  hot:  'Hot',
};

const MovieCard = ({ movie }: { movie: Movie }) => (
  <div className="group relative rounded-[10px] overflow-hidden bg-[#112055] border border-white/[0.07] hover:border-[#6ea8fe]/35 hover:-translate-y-[5px] transition-all duration-200 flex flex-col cursor-pointer">

    {/* Poster */}
    <div className="relative w-full aspect-[2/3] overflow-hidden flex-shrink-0">
      {movie.image ? (
        <img
          src={movie.image}
          alt={movie.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3"
          style={{ background: movie.gradient }}
        >
          <div className="w-12 h-12 rounded-full bg-white/[0.07] flex items-center justify-center">
            <Film size={22} color="rgba(255,255,255,0.4)" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col gap-1.5 w-20">
            <div className="h-[7px] rounded-[3px] bg-white/10 w-full" />
            <div className="h-[7px] rounded-[3px] bg-white/10 w-14" />
          </div>
        </div>
      )}

      {/* Badge */}
      <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold tracking-[0.8px] uppercase px-2 py-[3px] rounded-[4px] ${badgeStyles[movie.badge]}`}>
        {badgeLabel[movie.badge]}
      </span>

      {/* Hover play overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b3e] via-[#0d1b3e]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-200">
          <Play size={18} fill="#134686" stroke="none" />
        </div>
      </div>
    </div>

    {/* Card body */}
    <div className="p-3.5 flex flex-col gap-1.5 flex-1">
      <div className="flex items-center gap-2">
        <span className="text-[10.5px] font-semibold tracking-[0.5px] uppercase text-white/35">{movie.genre}</span>
        <span className="w-[3px] h-[3px] bg-white/20 rounded-full" />
        <span className="text-[11px] text-white/35 font-medium">{movie.year}</span>
      </div>

      <h3 className="text-[15px] font-bold text-white leading-[1.25] line-clamp-2">{movie.name}</h3>

      <p className="text-[12px] text-white/45 leading-[1.6] line-clamp-2 flex-1">{movie.desc}</p>

      <div className="flex items-center justify-between mt-2.5">
        <span className="flex items-center gap-1 text-[12px] font-semibold text-yellow-400">
          <Star size={11} fill="#facc15" stroke="none" />
          {movie.rating}
        </span>
        <span className="text-[11px] font-semibold text-[#6ea8fe]/80 bg-[#6ea8fe]/10 px-2 py-[2px] rounded-[4px]">
          {movie.releaseDate}
        </span>
      </div>

      {/* Notify button */}
      <button className="w-full mt-2.5 py-2 bg-[#6ea8fe]/[0.08] border border-[#6ea8fe]/20 rounded-md text-[#6ea8fe] text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#6ea8fe]/[0.16] hover:border-[#6ea8fe]/40 transition-all cursor-pointer">
        <Bell size={13} />
        Notify Me
      </button>
    </div>
  </div>
);

const UpcomingMovies = () => (
  <section className="px-[4%] py-12 bg-[#0d1b3e]">

    {/* Header */}
    <div className="flex items-end justify-between mb-7">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-[2px] bg-[#6ea8fe] rounded-full" />
          <span className="text-[11px] font-semibold tracking-[2px] uppercase text-[#6ea8fe]">Coming Soon</span>
        </div>
        <h2 className="text-[26px] font-bold text-white tracking-[-0.3px] leading-[1.1]">Upcoming Movies</h2>
      </div>
      <button className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6ea8fe] bg-transparent border-none cursor-pointer hover:gap-2.5 transition-all pb-1 group">
        See All
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>

    {/* Grid */}
    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
      {UPCOMING_MOVIES.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  </section>
);

export default UpcomingMovies;