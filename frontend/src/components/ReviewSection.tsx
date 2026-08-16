import React, { useState } from 'react';
import { Star, ThumbsUp, Send } from 'lucide-react';
import { ProductReview } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ReviewSectionProps {
  productId: string;
  reviews: ProductReview[];
  onReviewAdded?: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  reviews,
  onReviewAdded,
}) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Please enter a review title and content.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post(`/products/${productId}/reviews`, {
        rating,
        title,
        content,
      });

      if (res.data.success) {
        setSuccessMsg('Thank you! Your review has been published.');
        setTitle('');
        setContent('');
        if (onReviewAdded) onReviewAdded();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-8">
      {/* Header & Rating Breakdown */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-4xl font-black text-amber-400">{avgRating}</div>
            <div className="flex items-center justify-center gap-0.5 my-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(Number(avgRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <div className="text-[11px] text-slate-400">{reviews.length} Customer Reviews</div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Customer Reviews & Ratings</h3>
            <p className="text-xs text-slate-400">
              Authentic reviews from verified PricePilot users who compared and purchased this product.
            </p>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-white mb-4">Write a Product Review</h4>

        {!isAuthenticated ? (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
            Please <a href="/login" className="text-brand-400 font-semibold hover:underline">Log in</a> to write a review for this product.
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Review Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summary of your experience..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Detailed Review</label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts on performance, store delivery, and value..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No reviews submitted yet. Be the first to write a review!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
                    {rev.user?.name ? rev.user.name[0] : 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{rev.user?.name || 'Anonymous User'}</div>
                    <div className="text-[10px] text-slate-500">Verified Buyer</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h5 className="text-sm font-bold text-slate-100">{rev.title}</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{rev.content}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60">
                <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                <button className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
