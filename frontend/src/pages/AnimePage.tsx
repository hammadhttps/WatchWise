import AnimeCard from '../components/anime/AnimeCard';
import { useTopAnime } from '../hooks/useTopAnime';

const AnimePage = () => {
  const { anime, page, setPage, totalPages, loading, error } = useTopAnime();

  return (
    <div className="min-h-screen bg-[#0d1b3e] text-white font-sans pt-[88px]">
      <div className="px-[4%] pb-20 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-[2px] bg-[#6ea8fe] rounded-full" />
              <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#6ea8fe]">Anime Hub</span>
            </div>
            <h1 className="text-[38px] font-bold tracking-[-0.5px] text-white">Top Anime Movies</h1>
            <p className="max-w-2xl text-[15px] text-white/60 leading-[1.85] mt-3">
              Discover the most popular anime-style movies from TMDB with Japanese animation filtered by popularity.
            </p>
          </div>
          <button
            onClick={() => setPage(1)}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/10 bg-white/10 px-5 py-3 text-[13.5px] font-semibold text-white transition hover:bg-white/15"
          >
            Refresh list
          </button>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-100">
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[430px] animate-pulse rounded-[18px] bg-[#112055]" />
              ))
            : anime.slice(0, 6).map((item) => <AnimeCard key={item.id} anime={item} />)}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-white/50">
            Showing page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimePage;
