import { Play, Video, Heart, Bookmark, Share2, ArrowLeft, Quote, Users, Loader2 } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMovieDetail } from '../hooks/useMovieDetail';
import MovieHero from '../components/movie/MovieHero';
import MovieScore from '../components/movie/MovieScore';
import MovieDetailsSidebar from '../components/movie/MovieDetailsSidebar';
import MovieStreaming from '../components/movie/MovieStreaming';
import MovieReviews from '../components/movie/MovieReviews';
import CommunityReviews from '../components/movie/CommunityReviews';
import MovieMedia from '../components/movie/MovieMedia';
import MovieSimilar from '../components/movie/MovieSimilar';
import TrailerModal from '../components/movie/TrailerModal';
import { quoteAPI, partyAPI } from '../services/api';
import type { Video as MovieVideo } from '../types/movieDetails';
import useAuth from '../hooks/useAuth';
import useLikes from '../hooks/useLikes';
import useWatchlist from '../hooks/useWatchlist';

const LoadingSkeleton = () => (
  <div className="bg-[#0d1b3e] min-h-screen text-white font-sans">
    <div className="relative w-full h-[480px] lg:h-[520px] overflow-hidden bg-gradient-to-br from-[#0f2347] via-[#091528] to-[#060e1c] animate-pulse" />
    <div className="px-[4%] pb-16 max-w-[1200px] mt-[-80px] relative z-10">
      <div className="flex items-center gap-3 flex-wrap my-9">
        <div className="h-12 w-36 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-12 w-36 bg-white/10 rounded-lg animate-pulse" />
      </div>
      <div className="grid gap-10" style={{ gridTemplateColumns: 'minmax(0,1fr) 340px' }}>
        <div>
          <div className="h-4 w-24 bg-white/5 rounded mb-3.5 animate-pulse" />
          <div className="h-20 bg-white/5 rounded mb-9 animate-pulse" />
        </div>
        <div>
          <div className="bg-[#112055]/60 border border-white/[0.08] rounded-xl p-5 mb-4 animate-pulse">
            <div className="h-20 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SingleMoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading } = useMovieDetail(Number(id));

  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState('Reviews');
  const [selectedTrailer, setSelectedTrailer] = useState<MovieVideo | null>(null);
  const [movieQuote, setMovieQuote] = useState<{ text?: string; author?: string | null; show?: string | null } | null>(null);
  const tabs = ['Reviews', 'Media', 'Related'];

  const { details, reviews, images, videos, similar, providers } = data || {
    details: {
      id: 0,
      title: '',
      poster_path: '',
      backdrop_path: '',
      release_date: '',
      vote_average: 0,
      overview: '',
      runtime: 0,
      genres: [],
      tagline: '',
      homepage: '',
      status: '',
      vote_count: 0,
      original_language: '',
      budget: 0,
      revenue: 0,
      production_companies: [],
    },
    reviews: [],
    images: { id: 0, backdrops: [], posters: [], logos: [] },
    videos: [],
    similar: [],
    providers: null,
  };

  const liked = isLiked(details.id);
  const saved = isInWatchlist(details.id);

  const handleCollect = (action: 'like' | 'save') => {
    if (!details.id) return;
    if (!user) {
      navigate('/sign');
      return;
    }
    const payload = {
      tmdbId: details.id,
      title: details.title,
      posterPath: details.poster_path,
      genres: details.genres?.map(g => g.name) ?? [],
      year: Number(details.release_date?.split('-')[0]) || null
    };
    if (action === 'like') toggleLike(payload);
    else toggleWatchlist(payload);
  };

  const [creatingParty, setCreatingParty] = useState(false);

  const handleStartParty = async () => {
    if (!details.id) return;
    if (!user) {
      navigate('/sign');
      return;
    }
    setCreatingParty(true);
    try {
      const { party } = await partyAPI.createParty({
        movieId: details.id,
        movieTitle: details.title,
        posterPath: details.poster_path,
        backdropPath: details.backdrop_path
      });
      navigate(`/party/${party.id}`);
    } catch {
      setCreatingParty(false);
    }
  };

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const response = await quoteAPI.getQuote(details.title);
        if (response?.quote) {
          setMovieQuote(response.quote);
        }
      } catch (error) {
        console.error('Failed to load movie quote', error);
      }
    };

    if (!details?.title) return;
    loadQuote();
  }, [details?.title]);
  
  if (loading || !data) {
    return <LoadingSkeleton />;
  }

  const backdropUrl = images.backdrops?.[0]?.file_path
    ? `https://image.tmdb.org/t/p/original${images.backdrops[0].file_path}`
    : null;
  
  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : null;

  return (
    <div className="bg-[#0d1b3e] min-h-screen text-white font-sans">
      {/* ── BACKDROP & HERO ── */}
      <MovieHero 
        details={details} 
        backdropUrl={backdropUrl} 
        posterUrl={posterUrl} 
      />

      {/* ── BACK BUTTON ── */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-[4%] z-20 flex items-center gap-1.5 bg-white/[0.08] border border-white/15 text-white/75 hover:text-white hover:bg-white/14 text-[13px] font-semibold px-3.5 py-[7px] rounded-[7px] transition-all cursor-pointer"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Back
      </button>

      {/* ── BODY ── */}
      <div className="px-[4%] pb-16 max-w-[1200px]">

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap my-9">
          <button className="flex items-center gap-2 bg-white text-[#134686] border-none px-7 py-3 text-[15px] font-bold rounded-lg cursor-pointer hover:bg-[#ddeaff] active:scale-[.98] transition-all">
            <Play size={17} fill="#134686" stroke="none" /> Watch Now
          </button>
          <button
            onClick={() => {
              const trailer = videos.find((video: MovieVideo) => video.site === 'YouTube' && video.type === 'Trailer');
              setSelectedTrailer(trailer || null);
            }}
            className="flex items-center gap-2 bg-white/10 text-white border border-white/22 px-6 py-[11px] text-[15px] font-semibold rounded-lg cursor-pointer hover:bg-white/18 transition-all"
          >
            <Video size={17} /> Watch Trailer
          </button>
          <button
            onClick={handleStartParty}
            disabled={creatingParty}
            className="flex items-center gap-2 bg-[#6ea8fe]/15 text-[#6ea8fe] border border-[#6ea8fe]/35 px-6 py-[11px] text-[15px] font-semibold rounded-lg cursor-pointer hover:bg-[#6ea8fe]/25 transition-all disabled:opacity-60"
          >
            {creatingParty ? <Loader2 size={17} className="animate-spin" /> : <Users size={17} />}
            Watch Party
          </button>
          {[
            { Icon: Heart, active: liked, toggle: () => handleCollect('like'), activeClass: 'bg-red-500/15 border-red-400/35 text-red-400', fill: liked },
            { Icon: Bookmark, active: saved, toggle: () => handleCollect('save'), activeClass: 'bg-[#6ea8fe]/15 border-[#6ea8fe]/35 text-[#6ea8fe]', fill: saved },
            { Icon: Share2, active: false, toggle: () => {}, activeClass: '', fill: false },
          ].map(({ Icon, active, toggle, activeClass, fill }, i) => (
            <button
              key={i}
              onClick={toggle}
              className={`w-[46px] h-[46px] rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                active && activeClass ? activeClass : 'bg-white/[0.08] border-white/15 text-white/70 hover:bg-[#6ea8fe]/15 hover:border-[#6ea8fe]/35 hover:text-[#6ea8fe]'
              }`}
            >
              <Icon size={17} fill={fill ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>

        {/* Two-col layout */}
        <div className="grid gap-10" style={{ gridTemplateColumns: 'minmax(0,1fr) 340px' }}>

          {/* ── MAIN ── */}
          <div className="min-w-0">

            {/* Synopsis */}
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-[18px] h-[2px] bg-[#6ea8fe] rounded-full" />
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#6ea8fe]">Synopsis</span>
            </div>
            <p className="text-[15px] text-white/65 leading-[1.8] mb-9">
              {details.overview || 'No synopsis available.'}
            </p>

            {movieQuote?.text && (
              <div className="mb-6 rounded-2xl border border-[#6ea8fe]/20 bg-[#6ea8fe]/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-[#6ea8fe]">
                  <Quote size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-[2px]">Movie Quote</span>
                </div>
                <p className="text-[15px] leading-[1.7] text-white/80">“{movieQuote.text}”</p>
                {movieQuote.author && (
                  <p className="mt-2 text-[12px] text-white/45">— {movieQuote.author}</p>
                )}
              </div>
            )}


            {/* Tabs */}
            <div className="flex gap-1 border-b border-white/[0.08] mb-5">
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 text-[13px] font-semibold border-b-2 -mb-px transition-all cursor-pointer bg-transparent border-l-0 border-r-0 border-t-0 font-sans ${
                    activeTab === t
                      ? 'text-[#6ea8fe] border-b-[#6ea8fe]'
                      : 'text-white/40 border-b-transparent hover:text-white/70'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'Reviews' && (
              <>
                <CommunityReviews
                  movieId={details.id}
                  movieTitle={details.title}
                  criticScore={details.vote_average}
                  criticCount={details.vote_count}
                />
                <MovieReviews reviews={reviews} />
              </>
            )}
            {activeTab === 'Media' && <MovieMedia videos={videos} onSelectTrailer={setSelectedTrailer} />}
            {activeTab === 'Related' && (
              similar && similar.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {similar.slice(0, 6).map(m => (
                    <div key={m.id} className="cursor-pointer group">
                      <Link to={`/movie/${m.id}`}>
                      <div className="aspect-[2/3] rounded-lg mb-2 overflow-hidden bg-gradient-to-br from-[#1a3a6e] via-[#0e2247] to-[#091630]">
                        {m.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                            alt={m.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play size={24} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <p className="text-[12px] font-semibold text-white/75 leading-[1.3] line-clamp-1">{m.title}</p>
                      <p className="text-[11px] text-white/35">{m.release_date?.split('-')[0]}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-white/35 py-4">No related movies available.</p>
              )
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="min-w-0">
            <MovieScore details={details} />
            <MovieDetailsSidebar details={details} />
            <MovieStreaming providers={providers} />
            <MovieSimilar movies={similar} />
          </div>
        </div>
      </div>

      <TrailerModal video={selectedTrailer} onClose={() => setSelectedTrailer(null)} />
    </div>
  );
};

export default SingleMoviePage;
