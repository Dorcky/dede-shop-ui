"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/store/useAuth";
import { X, AlertTriangle } from "lucide-react";
import type { User } from "@/types";

// ✅ Type personnalisé pour la fonction de traduction (satisfait ESLint)
type TranslationFunction = (key: string) => string;

type EditMode = "name" | "email" | "phone" | "password" | null;

// ✅ 1. COMPOSANT ROW (avec type strict pour `t`)
const Row = ({
  t,
  label,
  value,
  onEdit,
  actionLabel,
  extra,
  showWarning,
  warningText,
  secondAction
}: {
  t: TranslationFunction;
  label: string;
  value: string;
  onEdit: () => void;
  actionLabel?: string;
  extra?: React.ReactNode;
  showWarning?: boolean;
  warningText?: string;
  secondAction?: { label: string; onClick: () => void };
}) => (
  <div className="flex items-start justify-between p-4 transition-colors hover:bg-slate-50/50">
    <div className="flex-1 pr-4">
      <p className="text-sm font-bold text-slate-900">{label}:</p>
      <p className="mt-0.5 text-sm text-slate-900">{value}</p>
      {extra}
      {showWarning && warningText && (
        <div className="mt-2 flex items-start gap-1.5 pt-2 text-xs text-slate-700">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-amber-500 text-[10px] font-bold text-white">
            <AlertTriangle className="h-2.5 w-2.5" />
          </span>
          <span className="leading-4">{warningText}</span>
        </div>
      )}
    </div>
    <div className="flex shrink-0 flex-col gap-2">
      <button
        onClick={onEdit}
        className="min-w-[80px] rounded-none border border-slate-300 bg-white px-6 py-1.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
      >
        {actionLabel || t("edit")}
      </button>
      {secondAction && (
        <button
          onClick={secondAction.onClick}
          className="min-w-[80px] rounded-none border border-slate-300 bg-white px-6 py-1.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
        >
          {secondAction.label}
        </button>
      )}
    </div>
  </div>
);

// ✅ 2. COMPOSANT MODAL (avec type strict pour `t`)
const Modal = ({
  t,
  title,
  children,
  onSave,
  saveLabel,
  onClose
}: {
  t: TranslationFunction;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  saveLabel?: string;
  onClose: () => void;
}) => (
  <>
    <div
      className="fixed inset-0 z-[9998] bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md border border-slate-200 bg-white shadow-2xl sm:rounded-none">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label={t("cancel")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          {children}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onSave}
              className="rounded-none bg-brand-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
            >
              {saveLabel || t("saveChanges")}
            </button>
            <button
              onClick={onClose}
              className="rounded-none border border-slate-300 px-5 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-slate-50"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);

// ✅ 3. COMPOSANT PRINCIPAL
export default function SecurityManager() {
  const t = useTranslations("account");
  const { user, setUser } = useAuth();
  const [editMode, setEditMode] = useState<EditMode>(null);

  const [nameValue, setNameValue] = useState(user?.name || "");
  const [emailValue, setEmailValue] = useState(user?.email || "");
  const [phoneValue, setPhoneValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetForm = () => {
    setEditMode(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const saveUserUpdate = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    setUser(updatedUser);

    const saved = localStorage.getItem("dnk-user-db");
    const users: User[] = saved ? JSON.parse(saved) : [];
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = updatedUser;
      localStorage.setItem("dnk-user-db", JSON.stringify(users));
    }
  };

  const handleSaveName = () => {
    saveUserUpdate({ name: nameValue });
    toast.success(t("changesSaved"));
    resetForm();
  };

  const handleSaveEmail = () => {
    saveUserUpdate({ email: emailValue });
    toast.success(t("changesSaved"));
    resetForm();
  };

  const handleSavePhone = () => {
    toast.success(t("changesSaved"));
    resetForm();
  };

  const handleSavePassword = () => {
    if (!user) return;
    if (currentPassword !== user.password) {
      toast.error(t("wrongCurrentPassword"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    if (newPassword.length < 4) {
      toast.error("Le mot de passe doit contenir au moins 4 caractères.");
      return;
    }
    saveUserUpdate({ password: newPassword });
    toast.success(t("passwordChanged"));
    resetForm();
  };

  const inputClass =
    "w-full border border-slate-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600/20 rounded-none";
  const labelClass =
    "mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700";

  if (!user) return null;

  return (
    <div>
      <nav className="mb-4 flex items-center space-x-1 text-xs text-slate-500">
        <Link
          href="/account"
          className="text-brand-600 hover:text-brand-700 hover:underline"
        >
          {t("yourAccount")}
        </Link>
        <span className="text-slate-400">&rsaquo;</span>
        <span className="font-semibold text-amber-700">
          {t("loginSecurity")}
        </span>
      </nav>

      <h2 className="mb-6 text-3xl font-black text-slate-900">
        {t("loginSecurity")}
      </h2>

      <div className="divide-y divide-slate-200 border border-slate-300 bg-white">
        <Row
          t={t}
          label={t("name")}
          value={user.name}
          onEdit={() => {
            setNameValue(user.name);
            setEditMode("name");
          }}
        />
        <Row
          t={t}
          label={t("email")}
          value={user.email}
          onEdit={() => {
            setEmailValue(user.email);
            setEditMode("email");
          }}
        />
        <Row
          t={t}
          label={t("primaryMobile")}
          value={phoneValue || "+1 (555) 000-0000"}
          onEdit={() => {
            setPhoneValue("");
            setEditMode("phone");
          }}
          showWarning={!phoneValue}
          warningText={t("mobileSecurityHint")}
          secondAction={{
            label: t("verify"),
            onClick: () => toast.info("Vérification SMS simulée.")
          }}
        />
        <Row
          t={t}
          label={t("passkey")}
          value={t("passkeyDesc")}
          onEdit={() =>
            toast.info("Les clés d'accès seront disponibles prochainement.")
          }
        />
        <Row
          t={t}
          label={t("password")}
          value="********"
          onEdit={() => setEditMode("password")}
        />
        <Row
          t={t}
          label={t("twoStepVerification")}
          value=""
          onEdit={() => toast.info("La 2FA sera disponible prochainement.")}
          actionLabel={t("turnOn")}
          showWarning={true}
          warningText={t("twoStepDesc")}
        />
        <Row
          t={t}
          label={t("compromisedAccount")}
          value={t("compromisedDesc")}
          onEdit={() => toast.info("Processus de sécurité simulé.")}
          actionLabel={t("start")}
        />
      </div>

      {/* ===== MODALES ===== */}
      {editMode === "name" && (
        <Modal
          t={t}
          title={t("editName")}
          onSave={handleSaveName}
          onClose={resetForm}
        >
          <div>
            <label className={labelClass}>{t("name")}</label>
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              className={inputClass}
              autoFocus
            />
          </div>
        </Modal>
      )}

      {editMode === "email" && (
        <Modal
          t={t}
          title={t("editEmail")}
          onSave={handleSaveEmail}
          onClose={resetForm}
        >
          <div>
            <label className={labelClass}>{t("email")}</label>
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className={inputClass}
              autoFocus
            />
          </div>
        </Modal>
      )}

      {editMode === "phone" && (
        <Modal
          t={t}
          title={t("editPhone")}
          onSave={handleSavePhone}
          onClose={resetForm}
        >
          <div>
            <label className={labelClass}>{t("primaryMobile")}</label>
            <input
              type="tel"
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={inputClass}
              autoFocus
            />
            <p className="mt-2 text-xs text-slate-500">
              {t("mobileSecurityHint")}
            </p>
          </div>
        </Modal>
      )}

      {editMode === "password" && (
        <Modal
          t={t}
          title={t("editPassword")}
          onSave={handleSavePassword}
          onClose={resetForm}
        >
          <div>
            <label className={labelClass}>{t("currentPassword")}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
              autoFocus
            />
          </div>
          <div>
            <label className={labelClass}>{t("newPassword")}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t("confirmNewPassword")}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
