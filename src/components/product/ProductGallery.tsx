"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface ProductGalleryProps {
  images: string[];
  selectedImage: string;
  onImageSelect: (image: string) => void;
  productName: string;
}

export default function ProductGallery({
  images,
  selectedImage,
  onImageSelect,
  productName
}: ProductGalleryProps) {
  const t = useTranslations("product");

  return (
    <div className="lg:sticky lg:top-24">
      {/* Image principale */}
      <div className="aspect-square overflow-hidden bg-slate-100">
        <Image
          src={selectedImage}
          alt={productName}
          width={800}
          height={800}
          className="h-full w-full object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 sm:mt-4 sm:gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onImageSelect(img)}
              className={`h-16 w-16 shrink-0 overflow-hidden border-2 transition sm:h-20 sm:w-20 ${
                selectedImage === img
                  ? "border-brand-600 ring-2 ring-brand-600"
                  : "border-transparent hover:border-slate-300"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} - ${t("imageAlt")} ${i + 1}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
