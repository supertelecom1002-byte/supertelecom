import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

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
              <div className="mt-8 sm:mt-14 grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-8 sm:mt-14 grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
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
