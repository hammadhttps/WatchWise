import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAnimeDetail } from '../hooks/useAnimeDetail';

const AnimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const animeId = Number(id);
  const { anime, loading, error } = useAnimeDetail(animeId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1b3e] text-white font-sans pt-[88px] px-[4%]">
        <div className="max-w-[1200px] mx-auto animate-pulse">
          <div className="h-[520px] rounded-[30px] bg-[#112055] mb-10" />
          <div className="space-y-4">
            <div className="h-8 w-3/5 rounded bg-white/10" />
            <div className="h-5 w-2/5 rounded bg-white/10" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-64 rounded-[24px] bg-white/10" />
              <div className="h-64 rounded-[24px] bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[#0d1b3e] text-white font-sans pt-[88px] px-[4%]">
        <div className="max-w-[800px] mx-auto py-20 text-center">
          <p className="text-[18px] text-red-300">{error ?? 'Anime details could not be loaded.'}</p>
          <Link
            to="/anime"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-white/15"
          >
            <ArrowLeft size={16} /> Back to Anime Hub
          </Link>
        </div>
      </div>
    );
  }

  const coverImage = anime.images.jpg.large_image_url;
  const trailerUrl = anime.trailer?.embed_url || anime.trailer?.url || undefined;

  return (
    <div className="min-h-screen bg-[#0d1b3e] text-white font-sans pt-[88px]">
      <div className="px-[4%] pb-20 max-w-[1200px] mx-auto">
        <div className="mb-10">
          <Link
            to="/anime"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[13px] text-white/80 transition hover:bg-white/15"
          >
            <ArrowLeft size={14} /> Back to Anime Hub
          </Link>
        </div>

        <div className="grid gap-10 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#112055] shadow-xl">
              <img src={coverImage} alt={anime.title} className="w-full object-cover" />
            </div>

            <div className="rounded-[30px] border border-white/[0.08] bg-[#112055]/80 p-6">
              <h2 className="text-[24px] font-bold text-white mb-3">{anime.title}</h2>
              <p className="text-[14px] text-white/60 leading-[1.8]">{anime.synopsis ?? 'No synopsis available.'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-white/[0.08] bg-[#112055]/80 p-6">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="rounded-full bg-[#6ea8fe]/10 px-3 py-1 text-[12px] font-semibold text-[#6ea8fe]">{anime.type}</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[12px] text-white/70">{anime.status}</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[12px] text-white/70">{anime.episodes ?? 'N/A'} Ep</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[12px] uppercase tracking-[2px] text-white/50 mb-2">Score</p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-[14px] font-semibold text-white">
                    <Star size={16} fill="#facc15" stroke="none" />
                    {anime.score?.toFixed(1) ?? '—'}
                  </div>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-[2px] text-white/50 mb-2">Year</p>
                  <p className="text-[15px] font-semibold text-white">{anime.year ?? '—'}</p>
                </div>
              </div>

              {anime.genres.length > 0 && (
                <div className="mt-5">
                  <p className="text-[12px] uppercase tracking-[2px] text-white/50 mb-3">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <span key={genre.mal_id} className="rounded-full bg-white/5 px-3 py-1 text-[12px] text-white/70">{genre.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {anime.studios.length > 0 && (
                <div className="mt-5">
                  <p className="text-[12px] uppercase tracking-[2px] text-white/50 mb-3">Studios</p>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.map((studio) => (
                      <span key={studio.name} className="rounded-full bg-white/5 px-3 py-1 text-[12px] text-white/70">{studio.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {anime.producers.length > 0 && (
                <div className="mt-5">
                  <p className="text-[12px] uppercase tracking-[2px] text-white/50 mb-3">Producers</p>
                  <div className="flex flex-wrap gap-2">
                    {anime.producers.map((producer) => (
                      <span key={producer.name} className="rounded-full bg-white/5 px-3 py-1 text-[12px] text-white/70">{producer.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {trailerUrl && (
              <div className="rounded-[30px] border border-white/[0.08] bg-[#112055]/80 p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[12px] uppercase tracking-[2px] text-white/50">Trailer</p>
                    <p className="text-[15px] font-semibold text-white">Watch the official preview</p>
                  </div>
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[13px] text-white transition hover:bg-white/15"
                  >
                    <ExternalLink size={16} /> Open Trailer
                  </a>
                </div>
                <div className="aspect-video overflow-hidden rounded-[24px] border border-white/[0.08] bg-black">
                  <iframe
                    src={trailerUrl?.replace('/watch?v=', '/embed/')}
                    title="anime trailer"
                    className="h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;
