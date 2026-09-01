"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store/useAuth";

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComplaintModal({
  isOpen,
  onClose
}: ComplaintModalProps) {
  const t = useTranslations("complaint");
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      type: "COMPLAINT",
      orderId: null,
      userId: user?.id || null,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      reason: null,
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
      onClose();
    } catch {
      // ✅ TRADUIT : Plus de texte en dur
      toast.error(t("errorOccurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
            <h2 className="text-lg font-black text-slate-900 sm:text-xl">
              {t("title")}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
              aria-label={t("close")} // ✅ TRADUIT
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="grid gap-4 p-5 sm:p-6">
            <input
              name="name"
              required
              placeholder={t("name")}
              defaultValue={user?.name || ""}
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
            <input
              name="email"
              required
              type="email"
              placeholder={t("email")}
              defaultValue={user?.email || ""}
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
            <select
              name="subject"
              required
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            >
              <option value="COMMANDE_NON_RECUE">{t("subject1")}</option>
              <option value="PRODUIT_ENDOMMAGE">{t("subject2")}</option>
              <option value="REMBOURSEMENT">{t("subject3")}</option>
              <option value="AUTRE">{t("subject4")}</option>
            </select>
            <textarea
              name="message"
              required
              rows={5}
              placeholder={t("message")}
              className="w-full resize-y border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:opacity-50 sm:py-4"
            >
              {/* ✅ TRADUIT : État de chargement dynamique */}
              {isSubmitting ? t("sending") : t("submit")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
