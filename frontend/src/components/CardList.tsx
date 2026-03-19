
import MovieCard from './MovieCard';
import { useUpcomingMovies } from '../hooks/useUpcomingMovies';


interface CardListProps {
  title: string;
  Category1: string;
}
const CardList = ({ title, Category1 }: CardListProps) => {
  const { movies, page, totalPages, setPage } = useUpcomingMovies(Category1);
  return (
    <section className="px-[4%] py-12 bg-[#0d1b3e]">
      <div className="flex items-end justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-[2px] bg-[#6ea8fe] rounded-full" />
            <span className="text-[11px] font-semibold tracking-[2px] uppercase text-[#6ea8fe]">{title}</span>
          </div>
          <h2 className="text-[26px] font-bold text-white tracking-[-0.3px] leading-[1.1]">{Category1}</h2>
        </div>
       
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-white/10 border border-white/20 text-white/80 rounded-md text-[13px] font-semibold cursor-pointer hover:bg-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <span className="text-[14px] text-white/60 font-medium">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-white/10 border border-white/20 text-white/80 rounded-md text-[13px] font-semibold cursor-pointer hover:bg-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </section>
  );
};
export default CardList;