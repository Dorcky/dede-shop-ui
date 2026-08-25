"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ContactTopic, Locale } from "@/types";
import { useAuth } from "@/lib/store/useAuth";

interface ContactFormProps {
  topics: ContactTopic[];
  locale: Locale;
}

export default function ContactForm({ topics, locale }: ContactFormProps) {
  const t = useTranslations("contact");
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      topicId: formData.get("topic") as string,
      message: formData.get("message") as string,
      userId: user?.id || null
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Failed");

      toast.success(t("sent"));
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
        name="topic"
        required
        className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      >
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name[locale]}
          </option>
        ))}
      </select>
      <textarea
        name="message"
        required
        rows={7}
        placeholder={t("message")}
        className="w-full resize-y border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-slate-900 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:opacity-50 sm:py-4"
      >
        {isSubmitting ? "..." : t("send")}
      </button>
    </form>
  );
}
