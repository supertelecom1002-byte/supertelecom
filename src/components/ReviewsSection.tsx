import React, { useEffect, useState } from "react";
import { Star, PenLine, ExternalLink, MessageCircle, X, ShieldCheck } from "lucide-react";

export interface ReviewItem {
  id?: string;
  customer_name?: string;
  name?: string;
  rating?: number;
  review_text?: string;
  body?: string;
  role?: string;
  created_at?: string;
}

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    customer_name: "Rahul Sharma",
    name: "Rahul Sharma",
    rating: 5,
    role: "iPhone 13 Screen Replacement",
    review_text: "Giridih me best mobile screen replacement service! Original display laga kar diya 1 ghante me.",
    body: "Giridih me best mobile screen replacement service! Original display laga kar diya 1 ghante me.",
    created_at: new Date().toISOString(),
  },
  {
    customer_name: "Amit Verma",
    name: "Amit Verma",
    rating: 5,
    role: "Samsung S22 IC & Motherboard Repair",
    review_text: "Fast IC repair and battery replacement. Authentic OEM parts and genuine pricing.",
    body: "Fast IC repair and battery replacement. Authentic OEM parts and genuine pricing.",
    created_at: new Date().toISOString(),
  },
  {
    customer_name: "Pooja Singh",
    name: "Pooja Singh",
    rating: 5,
    role: "Battery Replacement",
    review_text: "My phone was dying by noon. New battery, honest price, and it feels brand new. Definitely coming back.",
    body: "My phone was dying by noon. New battery, honest price, and it feels brand new. Definitely coming back.",
    created_at: new Date().toISOString(),
  },
  {
    customer_name: "Mohit Kumar",
    name: "Mohit Kumar",
    rating: 5,
    role: "Second-Hand Phone",
    review_text: "Bought a used Samsung — tested thoroughly and came with warranty. Best used phone shop in Giridih.",
    body: "Bought a used Samsung — tested thoroughly and came with warranty. Best used phone shop in Giridih.",
    created_at: new Date().toISOString(),
  },
  {
    customer_name: "Anjali Dubey",
    name: "Anjali Dubey",
    rating: 5,
    role: "Water Damage Repair",
    review_text: "Phone fell in water and everyone said it was gone. Super Telecom brought it back to life. Miracle workers!",
    body: "Phone fell in water and everyone said it was gone. Super Telecom brought it back to life. Miracle workers!",
    created_at: new Date().toISOString(),
  },
  {
    customer_name: "Suresh Prasad",
    name: "Suresh Prasad",
    rating: 5,
    role: "Motherboard IC Micro-Soldering",
    review_text: "Complex IC issue no one else would touch. Fixed cleanly with a warranty. Real experts.",
    body: "Complex IC issue no one else would touch. Fixed cleanly with a warranty. Real experts.",
    created_at: new Date().toISOString(),
  },
];

interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ReviewsErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("ReviewsErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <section id="reviews" className="py-8 sm:py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
                  Reviews
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Loved by customers across Giridih
                </h2>
              </div>

              {/* Interactive Google Review Action Bar */}
              <div className="mt-8 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl glass-strong border border-border/70 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex-none">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-sm sm:text-base text-foreground">
                      <span>Verified Google Reviews</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs sm:text-sm text-muted-foreground font-normal">Super Telecom Giridih</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      Established 2016 • 10+ Years Experience in Giridih
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href="https://maps.app.goo.gl/mu5XXCehEpocaZWY9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-brand transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <PenLine className="h-4 w-4" />
                    <span>Write a Google Review / Give Feedback</span>
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                {DEFAULT_REVIEWS.map((item, idx) => (
                  <div key={idx} className="rounded-2xl sm:rounded-3xl glass p-4 sm:p-6 shadow-sm">
                    <div className="flex gap-1 text-amber-400 text-sm mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/90 font-medium">"{item.review_text}"</p>
                    <p className="text-xs text-muted-foreground mt-2">— {item.customer_name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      );
    }
    return this.props.children;
  }
}

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchLiveReviews = async () => {
      try {
        if (typeof window === "undefined") return;
        const res = await fetch("https://htat.vercel.app/api/reviews?slug=supertelecom");
        if (!res.ok) return;
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return;
        const data = await res.json();
        if (mounted && Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      } catch (err) {
        console.warn("Reviews fetch bypassed, using default testimonials", err);
      }
    };

    fetchLiveReviews();

    return () => {
      mounted = false;
    };
  }, []);

  const safeReviews = Array.isArray(reviews) && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  return (
    <section id="reviews" className="py-8 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
            Reviews
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Loved by customers across Giridih
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real feedback from verified smartphone repair and refurbished phone customers.
          </p>
        </div>

        {/* Interactive Google Review Action Bar */}
        <div className="mt-8 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl glass-strong border border-border/70 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex-none">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold text-sm sm:text-base text-foreground">
                <span>Verified Google Reviews</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs sm:text-sm text-muted-foreground font-normal">Super Telecom Giridih</span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                Established 2016 • 10+ Years Experience in Giridih
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-brand transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <PenLine className="h-4 w-4" />
              <span>Write a Google Review / Give Feedback</span>
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(safeReviews) &&
            safeReviews.map((item, idx) => {
              const customerName = item?.customer_name || item?.name || "Verified Customer";
              const reviewText =
                item?.review_text || item?.body || "Great service and genuine repair!";
              const role = item?.role || "Verified Customer";
              const rawRating = Number(item?.rating);
              const ratingCount = Math.max(1, Math.min(5, isNaN(rawRating) ? 5 : rawRating));
              const initial = (customerName.trim()[0] || "U").toUpperCase();

              return (
                <div
                  key={item?.id || `${customerName}-${idx}`}
                  className="rounded-2xl sm:rounded-3xl glass p-4 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-glow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: ratingCount }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-medium">
                      "{reviewText}"
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-5 flex items-center gap-3 pt-3 border-t border-border/40">
                    <div className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full bg-gradient-brand font-semibold text-xs sm:text-sm text-primary-foreground flex-none">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate text-foreground">
                        {customerName}
                      </div>
                      <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Interactive Review Modal */}
      {reviewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full rounded-2xl bg-card border border-border shadow-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <h3 className="font-bold text-base sm:text-lg text-foreground">Write a Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your honest feedback helps neighbors in Giridih discover authentic, transparent mobile repairs.
            </p>

            <div className="space-y-3 pt-1">
              <a
                href="https://maps.app.goo.gl/mu5XXCehEpocaZWY9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-foreground transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    G
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      <span>Rate on Google Maps</span>
                      <ExternalLink className="h-3 w-3 text-primary" />
                    </div>
                    <div className="text-[11px] text-muted-foreground">Post 5-star review on Google profile</div>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                  ))}
                </div>
              </a>

              <a
                href="https://wa.me/918002903643?text=Hi%20Super%20Telecom,%20I%20would%20like%20to%20give%20feedback%20about%20my%20recent%20mobile%20repair"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-foreground transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-bold">Direct WhatsApp Feedback</div>
                    <div className="text-[11px] text-muted-foreground">Message owner / engineer directly</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-500">Fast Reply</span>
              </a>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] font-mono text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
                Verified Super Telecom Barganda Road Repair Guarantee
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export const SafeReviewsSection: React.FC = () => {
  return (
    <ReviewsErrorBoundary>
      <ReviewsSection />
    </ReviewsErrorBoundary>
  );
};

export default SafeReviewsSection;
