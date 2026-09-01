"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { X, Check, Package, Truck, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { Order } from "@/types";
import { useSettings } from "@/lib/store/useSettings";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  order
}: OrderDetailModalProps) {
  const t = useTranslations("order");
  const tAccount = useTranslations("account");
  const locale = useLocale() as "fr" | "en"; // ✅ Récupération dynamique de la locale
  const router = useRouter();
  const settings = useSettings();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      CONFIRMED: tAccount("confirmed"),
      PREPARING: tAccount("preparing"),
      SHIPPED: tAccount("shipped"),
      IN_TRANSIT: tAccount("inTransit"),
      DELIVERED: tAccount("delivered"),
      CANCELLED: tAccount("cancelled")
    };
    return map[status] || status;
  };

  const handleReturnRequest = () => {
    onClose();
    router.push(`/returns?orderId=${order.id}`);
  };

  // ✅ Formatage de la date selon la locale active
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "fr" ? "fr-FR" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
        <div className="w-full max-w-2xl bg-white shadow-2xl sm:rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-black text-slate-900 sm:text-xl">
              {t("detail")}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
              aria-label={t("close")} // ✅ TRADUIT
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Contenu */}
          <div className="p-5 sm:p-6">
            {/* En-tête commande */}
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:pb-5">
              <div>
                <p className="text-lg font-bold text-slate-900">{order.id}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {t("placedOn")} {formatDate(order.createdAt)}{" "}
                  {/* ✅ DATE LOCALISÉE */}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm font-bold text-brand-600">
                  {getStatusLabel(order.status)}
                </p>
                {order.tracking.find((s) => s.done && s.location) && (
                  <p className="mt-1 flex items-center justify-end gap-1 text-xs text-slate-500 sm:justify-end">
                    <MapPin className="h-3 w-3" />
                    {order.tracking.find((s) => s.done && s.location)?.location}
                  </p>
                )}
              </div>
            </div>

            {/* Tracking */}
            <div className="mt-6 sm:mt-7">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Truck className="h-4 w-4 text-brand-600" />
                {t("tracking")}
              </h3>
              <p className="mt-1 text-sm text-slate-500 sm:mt-2">
                {order.tracking.find((s) => s.eta)?.eta || t("inProgress")}
              </p>

              <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
                {order.tracking.map((step, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full sm:h-7 sm:w-7 ${
                          step.done
                            ? "bg-brand-600 text-white"
                            : "bg-slate-200 text-slate-500"
                        } text-xs font-bold`}
                      >
                        {step.done ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          idx + 1
                        )}
                      </span>
                      {idx < order.tracking.length - 1 && (
                        <span
                          className={`mt-1 h-6 w-px sm:h-8 ${
                            step.done ? "bg-brand-600" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-bold text-slate-900">
                        {/* ✅ UTILISATION DYNAMIQUE DE LA LOCALE AU LIEU DE .fr EN DUR */}
                        {step.label[locale]}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 sm:mt-1">
                        {step.date || t("upcoming")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Articles */}
            <div className="mt-6 border-t border-slate-200 pt-5 sm:mt-8 sm:pt-6">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Package className="h-4 w-4 text-brand-600" />
                {t("items")}
              </h3>
              <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-slate-100 sm:h-14 sm:w-14">
                      <Image
                        src={item.image}
                        alt={item.productName[locale]}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {item.productName[locale]}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {item.variantName[locale]}· {t("quantity")}{" "}
                        {item.quantity}
                        {item.isDigital && t("digitalNote")}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-slate-900">
                      {(item.price * item.quantity).toFixed(2)}{" "}
                      {settings.currencySymbol || "$"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-black text-slate-900 sm:mt-6">
                <span>{t("total")}</span>
                <span>
                  {order.total.toFixed(2)} {settings.currencySymbol || "$"}
                </span>
              </div>
            </div>

            {/* Bouton retour */}
            <button
              onClick={handleReturnRequest}
              className="mt-5 w-full border border-slate-300 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:border-slate-900 sm:mt-7"
            >
              {t("returnRequest")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
