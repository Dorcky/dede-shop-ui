"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { X, Upload, Star } from "lucide-react";
import { toast } from "sonner";
import { useReviews } from "@/lib/store/useReviews";
import { useAuth } from "@/lib/store/useAuth";
import { Product } from "@/types";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ReviewForm({
  isOpen,
  onClose,
  product
}: ReviewFormProps) {
  const t = useTranslations("review");
  const { addReview } = useReviews();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locale = (useLocale() as "fr" | "en") || "fr";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setName(user?.name || "");
    } else {
      document.body.style.overflow = "";
      resetForm();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, user]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const resetForm = () => {
    setName("");
    setRating(0);
    setComment("");
    setImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining);

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(t("selectRating"));
      return;
    }
    if (!product) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview = {
        id: `r-${Date.now()}`,
        productId: product.id,
        userId: user?.id || null,
        name: name || user?.name || t("anonymous"),
        rating,
        text: comment,
        images,
        date: new Date().toISOString().slice(0, 10),
        isApproved: true
      };

      addReview(newReview);
      toast.success(t("thankyou"));
      resetForm();
      onClose();
      setIsSubmitting(false);
    }, 500);
  };

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
        <div className="w-full max-w-lg bg-white shadow-2xl sm:rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                {t("leave")}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {product.name[locale]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
              aria-label={t("close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="grid gap-4 p-5 sm:p-6">
            {/* Nom */}
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("name")}
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />

            {/* Note avec étoiles cliquables */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                {t("rating")}
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 sm:h-8 sm:w-8 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Commentaire */}
            <textarea
              required
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("comment")}
              className="w-full resize-y border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />

            {/* Upload d'images */}
            <div>
              <label className="block cursor-pointer border border-dashed border-slate-300 p-3 text-center text-sm text-slate-500 transition hover:border-brand-600 hover:text-brand-600 sm:p-4">
                <Upload className="mx-auto mb-2 h-5 w-5" />
                {t("image")}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={images.length >= 5}
                />
              </label>

              {/* Preview grid */}
              {images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={img}
                        alt={`${t("preview")} ${i + 1}`}
                        width={80}
                        height={80}
                        className="h-16 w-16 rounded border border-slate-200 object-cover sm:h-20 sm:w-20"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow transition hover:bg-red-600"
                        aria-label={t("remove")}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton publier */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:opacity-50 sm:py-4"
            >
              {isSubmitting ? "..." : t("publish")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
