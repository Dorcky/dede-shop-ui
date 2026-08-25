"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import Image from "next/image";
import { useReviews } from "@/lib/store/useReviews";
import ReviewForm from "@/components/review/ReviewForm";
import { Product } from "@/types";

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const t = useTranslations("product");
  const { getReviewsByProduct } = useReviews();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  // Garde-fou anti-hydration-mismatch : premier rendu client = état "vide", comme le serveur
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const reviews = mounted ? getReviewsByProduct(product.id) : [];
  const rating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating;
  const reviewCount = reviews.length > 0 ? reviews.length : product.reviewCount;

  const stars = (value: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(value)
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-200"
        }`}
      />
    ));
  };

  return (
    <>
      <section className="mt-12 border-t border-slate-200 pt-10 sm:mt-16 sm:pt-12 lg:mt-20">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-10">
          {/* Note globale */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
              {t("reviews")}
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              {t("customersSay")}
            </h2>
            <div className="mt-4 sm:mt-6">
              <p className="text-3xl font-black text-slate-900 sm:text-4xl">
                {rating.toFixed(1)}/5
              </p>
              <div className="mt-1 flex gap-0.5 sm:mt-2">{stars(rating)}</div>
              <p className="mt-1 text-sm text-slate-500 sm:mt-2">
                {reviewCount} {t("reviewsCount")}
              </p>
            </div>
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="mt-5 bg-brand-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:mt-7 sm:px-5 sm:py-3"
            >
              {t("leaveReview")}
            </button>
          </div>

          {/* Liste des avis */}
          <div className="space-y-6 sm:space-y-7">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="border-b border-slate-200 pb-5 sm:pb-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{review.name}</p>
                      <div className="mt-1 flex gap-0.5">
                        {stars(review.rating)}
                      </div>
                    </div>
                    <time className="text-xs text-slate-400">
                      {review.date}
                    </time>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 sm:mt-3">
                    {review.text}
                  </p>
                  {/* Images de l'avis */}
                  {review.images && review.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                      {review.images.map((img, i) => (
                        <Image
                          key={i}
                          width={80}
                          height={80}
                          src={img}
                          alt={`Avis ${i + 1}`}
                          className="h-16 w-16 rounded border border-slate-200 object-cover sm:h-20 sm:w-20"
                        />
                      ))}
                    </div>
                  )}
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-500">{t("beFirst")}</p>
            )}
          </div>
        </div>
      </section>

      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        product={product}
      />
    </>
  );
}
