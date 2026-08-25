"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Review } from "@/types";

interface ReviewsState {
  reviews: Review[];
  addReview: (review: Review) => void;
  getReviewsByProduct: (productId: string) => Review[];
  getAverageRating: (productId: string) => number;
  getReviewCount: (productId: string) => number;
}

export const useReviews = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (review) => {
        set((state) => ({ reviews: [review, ...state.reviews] }));
      },

      getReviewsByProduct: (productId) => {
        return get().reviews.filter(
          (r) => r.productId === productId && r.isApproved
        );
      },

      getAverageRating: (productId) => {
        const reviews = get().reviews.filter(
          (r) => r.productId === productId && r.isApproved
        );
        if (reviews.length === 0) return 0;
        return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      },

      getReviewCount: (productId) => {
        return get().reviews.filter(
          (r) => r.productId === productId && r.isApproved
        ).length;
      }
    }),
    {
      name: "dnk-reviews-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
