"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Image from "next/image";
import { useAuth } from "@/lib/store/useAuth";
import { useOrders } from "@/lib/store/useOrders";
import { Package } from "lucide-react";

interface ReturnsFormProps {
  locale: "fr" | "en";
}

export default function ReturnsForm({ locale }: ReturnsFormProps) {
  const t = useTranslations("returns");
  const { user } = useAuth();
  const { orders } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const initialProductId = searchParams.get("productId") || "";

  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId);
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);

  const targetOrder = orders.find((o) => o.id === selectedOrderId);
  const targetItem = targetOrder?.items.find(
    (i) => i.productId === selectedProductId
  );

  const reasons = [
    { value: "DEFECTIVE", label: t("reasons.defective") },
    { value: "EXPECTATIONS", label: t("reasons.expectations") },
    { value: "DAMAGED", label: t("reasons.damaged") },
    { value: "INCORRECT", label: t("reasons.incorrect") },
    { value: "OTHER", label: t("reasons.other") }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const orderId = formData.get("orderId") as string;
    const productId = formData.get("productId") as string;

    if (!orderId || !productId) {
      toast.error("Veuillez sélectionner une commande et un article.");
      setIsSubmitting(false);
      return;
    }

    const order = orders.find((o) => o.id === orderId);

    const data = {
      type: "RETURN",
      orderId,
      productId,
      userId: user?.id || null,
      name: user?.name || order?.customerName || "Client",
      email: user?.email || order?.customerEmail || "",
      subject: `Retour pour la commande ${orderId}`,
      reason: formData.get("reason") as string,
      message: formData.get("message") as string
    };

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Failed");

      toast.success(t("success"));
      (e.target as HTMLFormElement).reset();
      setSelectedOrderId("");
      setSelectedProductId("");
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-lg bg-white p-5 shadow-sm sm:p-6 lg:p-8"
    >
      <h2 className="text-xl font-bold text-slate-900">{t("request")}</h2>

      {/* SCÉNARIO 1 : Un article est déjà sélectionné */}
      {targetItem ? (
        <div className="rounded-md border border-brand-200 bg-brand-50/50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-700">
            {/* ✅ TRADUCTION APPLIQUÉE ICI */}
            {t("itemToReturn")}
          </p>
          <div className="flex gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-slate-200 bg-white">
              {targetItem.image ? (
                <Image
                  src={targetItem.image}
                  alt={targetItem.productName[locale]}
                  fill
                  className="object-cover"
                />
              ) : (
                <Package className="h-6 w-6 p-2 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">
                {/* ✅ UTILISE LA LANGUE ACTUELLE (locale) */}
                {targetItem.productName[locale]}
              </p>
              <p className="text-xs text-slate-500">
                {/* ✅ TRADUCTIONS APPLIQUÉES ICI */}
                {t("variantLabel")} : {targetItem.variantName} | {t("qtyLabel")}{" "}
                : {targetItem.quantity}
              </p>
              <p className="mt-1 text-sm font-black text-slate-900">
                {targetItem.price} $
              </p>
            </div>
          </div>
          <input type="hidden" name="orderId" value={targetOrder!.id} />
          <input type="hidden" name="productId" value={targetItem.productId} />
        </div>
      ) : (
        /* SCÉNARIO 2 : Menus en cascade */
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
              {t("selectOrder")}
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => {
                setSelectedOrderId(e.target.value);
                setSelectedProductId("");
              }}
              required
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            >
              <option value="">-- Choisir une commande --</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} — {new Date(o.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {selectedOrderId && targetOrder && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Article concerné
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
                className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="">-- Choisir un article --</option>
                {targetOrder.items.map((item) => (
                  <option key={item.productId} value={item.productId}>
                    {/* ✅ Le nom s'adapte aussi à la langue dans le menu déroulant */}
                    {item.productName[locale]} ({item.variantName}) —{" "}
                    {item.price} $
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Motif du retour */}
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
          {t("reason")}
        </label>
        <select
          name="reason"
          required
          className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        >
          <option value="">-- Sélectionner un motif --</option>
          {reasons.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
          {t("explain")}
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t("explain")}
          className="w-full resize-y border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:opacity-50 sm:py-4"
      >
        {isSubmitting ? "..." : t("submit")}
      </button>
    </form>
  );
}
