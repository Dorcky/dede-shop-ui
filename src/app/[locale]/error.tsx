"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    // Log l'erreur à un service de monitoring (ex: Sentry) en production
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <AlertTriangle className="h-16 w-16 text-amber-500 sm:h-20 sm:w-20" />
      <h1 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm text-slate-500 sm:mt-3">{t("desc")}</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} variant="primary">
          {t("retry")}
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline">
          {t("backToHome")}
        </Button>
      </div>
    </div>
  );
}
