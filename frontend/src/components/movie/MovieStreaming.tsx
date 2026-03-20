import type { WatchProviders } from '../../types/movieDetails';

interface MovieStreamingProps {
  providers: WatchProviders | null;
}

const MovieStreaming = ({ providers }: MovieStreamingProps) => {
  return (
    <div className="bg-[#112055]/60 border border-white/[0.08] rounded-xl p-5 mb-4">
      <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/35 mb-2.5">Available On</p>
      {providers?.US?.flatrate && providers.US.flatrate.length > 0 ? (
        <div className="flex gap-2 flex-wrap">
          {providers.US.flatrate.map(p => (
            <span
              key={p.provider_id}
              className="text-[12px] font-bold px-3.5 py-[5px] rounded-md bg-white/[0.07] border border-white/12 text-white/65 cursor-pointer hover:bg-white/14 hover:text-white transition-all"
            >
              {p.provider_name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[12px] text-white/35">No streaming info available.</p>
      )}
    </div>
  );
};

export default MovieStreaming;
