import type { MovieDetails } from '../../types/movieDetails';

interface MovieScoreProps {
  details: MovieDetails;
}

const MovieScore = ({ details }: MovieScoreProps) => {
  const scorePercent = Math.round((details.vote_average || 0) * 10);
  const voteCount = details.vote_count || 0;

  return (
    <div className="bg-[#112055]/60 border border-white/[0.08] rounded-xl p-5 mb-4">
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-[72px] h-[72px] rounded-full flex-shrink-0 flex items-center justify-center relative"
          style={{ background: `conic-gradient(#6ea8fe 0% ${scorePercent}%, rgba(255,255,255,0.08) ${scorePercent}% 100%)` }}
        >
          <div className="w-14 h-14 rounded-full bg-[#0d1b3e] flex items-center justify-center text-[18px] font-bold text-[#6ea8fe]">
            {details.vote_average?.toFixed(1)}
          </div>
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">WatchWise Score</p>
          <p className="text-[12px] text-white/40 mt-0.5">Based on {voteCount.toLocaleString()} ratings</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { val: `${scorePercent}%`, label: 'Score' },
          { val: `${voteCount >= 1000 ? (voteCount / 1000).toFixed(1) + 'K' : voteCount}`, label: 'Ratings' },
        ].map(s => (
          <div key={s.label} className="text-center bg-white/[0.04] rounded-lg py-2.5">
            <div className="text-[17px] font-bold text-white">{s.val}</div>
            <div className="text-[10px] text-white/35 mt-0.5 tracking-[.4px]">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieScore;
