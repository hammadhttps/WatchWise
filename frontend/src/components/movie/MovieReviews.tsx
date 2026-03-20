import { Star } from 'lucide-react';
import type { Review } from '../../types/movieDetails';

interface MovieReviewsProps {
  reviews: Review[];
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const StarRow = ({ count }: { count: number }) => (
  <div className="flex gap-0.5 ml-auto">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={12}
        fill={i <= count ? '#facc15' : 'rgba(255,255,255,0.12)'}
        stroke="none"
      />
    ))}
  </div>
);

const MovieReviews = ({ reviews }: MovieReviewsProps) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-[14px] text-white/35 py-4">No reviews available yet.</p>;
  }

  const avatarColors = [
    { bg: 'rgba(110,168,254,0.15)', text: '#6ea8fe' },
    { bg: 'rgba(93,202,165,0.15)', text: '#5dcaa5' },
    { bg: 'rgba(250,199,75,0.15)', text: '#fac849' },
    { bg: 'rgba(237,147,177,0.15)', text: '#ed93b1' },
  ];

  return (
    <>
      {reviews.slice(0, 5).map((r, i) => {
        const reviewerInitials = getInitials(r.author || 'Anonymous');
        const color = avatarColors[i % avatarColors.length];
        
        return (
          <div key={r.id || i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-[18px] mb-3">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 border"
                style={{ background: color.bg, color: color.text, borderColor: color.text + '33' }}
              >
                {reviewerInitials}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">{r.author || 'Anonymous'}</p>
                <p className="text-[11px] text-white/30 mt-px">{formatDate(r.created_at)}</p>
              </div>
              {r.author_details?.rating && (
                <StarRow count={Math.round(r.author_details.rating / 2)} />
              )}
            </div>
            <p className="text-[13px] text-white/55 leading-[1.7] line-clamp-4">{r.content}</p>
          </div>
        );
      })}
    </>
  );
};

export default MovieReviews;
