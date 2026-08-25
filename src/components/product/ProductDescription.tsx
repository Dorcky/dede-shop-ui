import Image from "next/image";
import { useTranslations } from "next-intl";
import { DescriptionBlock, Locale } from "@/types";

interface ProductDescriptionProps {
  blocks: DescriptionBlock[];
  productName: string;
  locale: Locale;
}

export default function ProductDescription({
  blocks,
  productName,
  locale
}: ProductDescriptionProps) {
  const t = useTranslations("product");

  if (!blocks || blocks.length === 0) return null;

  return (
    <section className="mt-10 border-t border-slate-200 pt-10 sm:mt-14 sm:pt-14">
      <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
        {t("descriptionTitle")}
      </p>
      <div className="mt-5 max-w-3xl space-y-5">
        {blocks.map((block, idx) => {
          if (block.type === "image" && block.url) {
            return (
              <div key={idx} className="overflow-hidden rounded-lg">
                <Image
                  src={block.url}
                  alt={`${productName} - Image ${idx + 1}`}
                  width={900}
                  height={500}
                  className="h-auto w-full object-cover"
                />
              </div>
            );
          } else if (block.type === "paragraph" && block.content) {
            return (
              <p
                key={idx}
                className="text-base leading-7 text-slate-600 sm:text-lg"
              >
                {block.content[locale]}
              </p>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}
