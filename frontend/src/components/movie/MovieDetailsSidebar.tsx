import type { MovieDetails } from '../../types/movieDetails';

interface MovieDetailsSidebarProps {
  details: MovieDetails;
}

const formatRuntime = (mins: number | undefined) => {
  if (!mins) return 'N/A';
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const formatCurrency = (n: number | undefined) => {
  if (!n) return 'N/A';
  if (n >= 1000000000) return `$${(n / 1000000000).toFixed(1)}B`;
  if (n >= 1000000) return `$${(n / 1000000).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const languageMap: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  hi: 'Hindi',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ar: 'Arabic',
  th: 'Thai',
  tr: 'Turkish',
  sv: 'Swedish',
  nl: 'Dutch',
  pl: 'Polish',
  vi: 'Vietnamese',
  id: 'Indonesian',
  ms: 'Malay',
};

const formatLanguage = (code: string | undefined) => {
  if (!code) return 'N/A';
  return languageMap[code] || code.toUpperCase();
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3.5">
    <div className="w-[18px] h-[2px] bg-[#6ea8fe] rounded-full" />
    <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#6ea8fe]">{children}</span>
  </div>
);

const MovieDetailsSidebar = ({ details }: MovieDetailsSidebarProps) => {
  return (
    <div className="bg-[#112055]/60 border border-white/[0.08] rounded-xl p-5 mb-4">
      <SectionLabel>Details</SectionLabel>
      {[
        ['Studio', details.production_companies?.[0]?.name || 'N/A'],
        ['Release', formatDate(details.release_date)],
        ['Runtime', formatRuntime(details.runtime)],
        ['Budget', formatCurrency(details.budget)],
        ['Box Office', formatCurrency(details.revenue)],
        ['Language', formatLanguage(details.original_language)],
        ['Status', details.status || 'N/A'],
      ].map(([label, val]) => (
        <div key={label as string} className="flex justify-between items-start py-2.5 border-b border-white/[0.06] last:border-b-0 last:pb-0">
          <span className="text-[12px] text-white/35 font-medium">{label}</span>
          <span className="text-[13px] text-white/75 font-semibold text-right max-w-[160px]">{val}</span>
        </div>
      ))}
    </div>
  );
};

export default MovieDetailsSidebar;
