"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Locale } from "@/types";
import { useAuth } from "@/lib/store/useAuth";
import { useOrders } from "@/lib/store/useOrders";

interface ReturnsFormProps {
  locale: Locale;
}

export default function ReturnsForm({}: ReturnsFormProps) {
  const t = useTranslations("returns");
  const { user } = useAuth();
  const { orders } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrer les commandes de l'utilisateur connecté (ou toutes si non connecté)
  const userOrders = user
    ? orders.filter(
        (o) => o.userId === user.id || o.customerEmail === user.email
      )
    : [];

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

    if (!orderId) {
      toast.error("Sélectionnez une commande.");
      setIsSubmitting(false);
      return;
    }

    const order = orders.find((o) => o.id === orderId);

    const data = {
      type: "RETURN",
      orderId,
      userId: user?.id || null,
      name: user?.name || order?.customerName || "Client",
      email: user?.email || order?.customerEmail || "",
      subject: "Demande de retour",
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
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg bg-white p-5 shadow-sm sm:p-6 lg:p-8"
    >
      <h2 className="text-xl font-bold text-slate-900">{t("request")}</h2>

      <select
        name="orderId"
        required
        className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      >
        <option value="">{t("selectOrder")}</option>
        {userOrders.map((o) => (
          <option key={o.id} value={o.id}>
            {o.id} — {new Date(o.createdAt).toLocaleDateString()}
          </option>
        ))}
      </select>

      <select
        name="reason"
        className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      >
        {reasons.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <textarea
        name="message"
        required
        rows={5}
        placeholder={t("explain")}
        className="w-full resize-y border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      />

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
