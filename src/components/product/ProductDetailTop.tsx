"use client";

import { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import { Product, Locale } from "@/types";

interface ProductDetailTopProps {
  product: Product;
  categoryName: string;
  locale: Locale;
}

export default function ProductDetailTop({
  product,
  categoryName,
  locale
}: ProductDetailTopProps) {
  // État partagé pour la variante et l'image
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const initialImage = product.variants[0]?.images[0]?.url || "";
  const [selectedImage, setSelectedImage] = useState(initialImage);

  // Quand on clique sur une variante
  const handleVariantChange = (index: number) => {
    setSelectedVariantIndex(index);
    const newVariant = product.variants[index];
    if (newVariant?.images?.length > 0) {
      setSelectedImage(newVariant.images[0].url); // Change l'image principale
    }
  };

  // Quand on clique sur une miniature dans la galerie
  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  // Récupérer toutes les images uniques de toutes les variantes pour la galerie
  const allImages = product.variants.flatMap((v) =>
    v.images.map((img) => img.url)
  );
  const uniqueImages = Array.from(new Set(allImages));

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <ProductGallery
        images={uniqueImages}
        selectedImage={selectedImage}
        onImageSelect={handleImageSelect}
        productName={product.name[locale]}
      />
      <ProductInfo
        productId={product.id}
        productSlug={product.slug}
        categoryName={categoryName}
        productName={product.name}
        brand={product.brand}
        price={product.price}
        oldPrice={product.oldPrice}
        stock={product.stock}
        warranty={product.warranty}
        isDigital={product.isDigital}
        rating={product.rating}
        reviewCount={product.reviewCount}
        variants={product.variants}
        selectedVariantIndex={selectedVariantIndex}
        onVariantChange={handleVariantChange}
        locale={locale}
      />
    </div>
  );
}
