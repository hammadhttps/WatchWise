import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Trash2, Loader2, Users, Award, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reviewsAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';

interface CommunityReviewsProps {
  movieId: number;
  movieTitle: string;
  criticScore: number;
  criticCount: number;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const Stars = ({ value, size = 13 }: { value: number; size?: number }) => (
  <span className="inline-flex gap-[2px]">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={size}
        fill={i <= Math.round(value) ? '#facc15' : 'none'}
        className={i <= Math.round(value) ? 'text-yellow-400' : 'text-white/25'}
      />
    ))}
  </span>
);

const CommunityReviews = ({ movieId, movieTitle, criticScore, criticCount }: CommunityReviewsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['reviews', movieId];

  const { data } = useQuery({
    queryKey,
    queryFn: () => reviewsAPI.getReviews(movieId),
    enabled: !!movieId
  });

  const reviews = data?.reviews ?? [];
  const stats = data?.stats ?? { average: null, count: 0 };
  const myReview = user ? reviews.find(r => r.user === user.id) : undefined;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);

  const startEditing = () => {
    if (myReview) {
      setRating(myReview.rating);
      setText(myReview.text);
    }
    setEditing(true);
  };

  const submitMutation = useMutation({
    mutationFn: () => reviewsAPI.submitReview({ movieId, movieTitle, rating, text }),
    onSuccess: () => {
      setEditing(false);
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => reviewsAPI.deleteReview(movieId),
    onSuccess: () => {
      setRating(0);
      setText('');
      setEditing(false);
      queryClient.invalidateQueries({ queryKey });
    }
  });

  const showForm = user && (editing || !myReview);

  return (
    <div className="mb-10">
      {/* Community vs Critics */}
      <div className="grid grid-cols-2 gap-4 mb-7 max-w-[560px]">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Users size={14} className="text-[#6ea8fe]" />
            <span className="text-[11px] font-bold tracking-[1px] uppercase text-white/45">WatchWise Community</span>
          </div>
          {stats.count > 0 ? (
            <>
              <p className="text-[30px] font-black text-white leading-none">
                {stats.average}<span className="text-[15px] font-semibold text-white/35">/5</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Stars value={stats.average ?? 0} />
                <span className="text-[11.5px] text-white/40">{stats.count} review{stats.count > 1 ? 's' : ''}</span>
              </div>
            </>
          ) : (
            <p className="text-[13px] text-white/35 mt-1">No community reviews yet — be the first</p>
          )}
        </div>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Award size={14} className="text-yellow-400" />
            <span className="text-[11px] font-bold tracking-[1px] uppercase text-white/45">Critics (TMDB)</span>
          </div>
          <p className="text-[30px] font-black text-white leading-none">
            {criticScore?.toFixed(1)}<span className="text-[15px] font-semibold text-white/35">/10</span>
          </p>
          <p className="text-[11.5px] text-white/40 mt-2">{criticCount?.toLocaleString()} votes</p>
        </div>
      </div>

      {/* Write / edit form */}
      {!user ? (
        <div className="mb-7 p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl flex items-center justify-between gap-4">
          <p className="text-[13.5px] text-white/50">Sign in to rate and review this movie.</p>
          <Link to="/sign" className="flex-shrink-0 bg-white text-[#134686] text-[13px] font-bold py-2 px-4 rounded-lg hover:bg-[#ddeaff] transition-all">
            Sign In
          </Link>
        </div>
      ) : showForm ? (
        <div className="mb-7 p-5 bg-white/[0.04] border border-white/[0.08] rounded-xl">
          <p className="text-[13px] font-bold text-white mb-3">{myReview ? 'Edit your review' : 'Rate this movie'}</p>
          <div className="flex items-center gap-1.5 mb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer bg-transparent border-none p-0.5"
              >
                <Star
                  size={24}
                  fill={i <= (hoverRating || rating) ? '#facc15' : 'none'}
                  className={`transition-colors ${i <= (hoverRating || rating) ? 'text-yellow-400' : 'text-white/25'}`}
                />
              </button>
            ))}
            {rating > 0 && <span className="text-[13px] text-white/50 ml-2">{rating}/5</span>}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="What did you think? (optional)"
            className="w-full bg-white/[0.05] border border-white/10 text-white text-[14px] px-3.5 py-[11px] rounded-lg outline-none placeholder-white/25 focus:border-[#6ea8fe]/55 transition-all font-sans resize-none mb-3"
          />
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => submitMutation.mutate()}
              disabled={rating === 0 || submitMutation.isPending}
              className="flex items-center gap-2 bg-white text-[#134686] text-[13.5px] font-bold py-2.5 px-5 rounded-lg cursor-pointer hover:bg-[#ddeaff] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <PenLine size={14} />}
              {myReview ? 'Update Review' : 'Post Review'}
            </button>
            {editing && (
              <button onClick={() => setEditing(false)} className="text-[13px] text-white/45 hover:text-white cursor-pointer bg-transparent border-none">
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Review list */}
      <div className="flex flex-col gap-3">
        {reviews.map(review => (
          <div key={review._id} className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#6ea8fe]/20 border border-[#6ea8fe]/30 flex items-center justify-center">
                  <span className="text-[12px] font-bold text-[#6ea8fe]">{review.userName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-white leading-tight">
                    {review.userName}
                    {user && review.user === user.id && <span className="text-[11px] text-[#6ea8fe] ml-2">you</span>}
                  </p>
                  <p className="text-[11px] text-white/35">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Stars value={review.rating} />
                {user && review.user === user.id && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={startEditing}
                      title="Edit review"
                      className="text-white/35 hover:text-white cursor-pointer bg-transparent border-none p-1"
                    >
                      <PenLine size={13} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate()}
                      title="Delete review"
                      className="text-white/35 hover:text-red-400 cursor-pointer bg-transparent border-none p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {review.text && <p className="text-[13px] text-white/55 leading-[1.65]">{review.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityReviews;
