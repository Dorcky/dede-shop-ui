"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X, Lock, Mail, User as UserIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store/useAuth";
import { useRouter } from "@/i18n/navigation";
import type { User } from "@/types";

export default function AuthModal() {
  const t = useTranslations("auth");
  const router = useRouter();
  const {
    pendingUser,
    isAuthModalOpen,
    authMode,
    forgotEmail,
    closeAuthModal,
    setAuthMode,
    setUser,
    setPendingUser,
    setForgotEmail
  } = useAuth();

  const [mounted, setMounted] = useState(false);

  // États des formulaires
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [verifyOtp, setVerifyOtp] = useState("");
  const [forgotEmailInput, setForgotEmailInput] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Verrouille le scroll du body
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAuthModalOpen]);

  useEffect(() => {
    setVerifyOtp("");
    setResetOtp("");
    setResetPassword("");
  }, [authMode]);

  if (!mounted || !isAuthModalOpen) return null;

  // ====== HANDLERS ======
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = localStorage.getItem("dnk-user-db");
    const users: User[] = saved ? JSON.parse(saved) : [];
    const found = users.find((u) => u.email === loginEmail);

    if (found && found.password !== loginPassword) {
      toast.error(t("wrongPassword"));
      return;
    }

    const loggedIn = found || {
      id: `user-${Date.now()}`,
      name: loginEmail.split("@")[0],
      email: loginEmail,
      password: loginPassword,
      role: "CUSTOMER" as const,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!found) {
      users.push(loggedIn);
      localStorage.setItem("dnk-user-db", JSON.stringify(users));
    }

    setUser(loggedIn);
    closeAuthModal();
    toast.success(t("loginSuccess"));
    resetForms();
    router.push("/account");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== registerConfirm) {
      toast.error(t("passwordMismatch"));
      return;
    }
    if (registerPassword.length < 4) {
      toast.error(t("demoHint"));
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      role: "CUSTOMER",
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPendingUser(newUser);
    setAuthMode("verify");
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOtp !== "123456") {
      toast.error(t("invalidOtp"));
      return;
    }
    if (!pendingUser) return;

    const saved = localStorage.getItem("dnk-user-db");
    const users: User[] = saved ? JSON.parse(saved) : [];
    const verifiedUser = { ...pendingUser, isVerified: true };
    users.push(verifiedUser);
    localStorage.setItem("dnk-user-db", JSON.stringify(users));

    setUser(verifiedUser);
    closeAuthModal();
    toast.success(t("accountVerified"));
    resetForms();
    router.push("/account");
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmail(forgotEmailInput);
    setAuthMode("reset");
    toast.success(t("otpSentDemo"));
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetOtp !== "654321") {
      toast.error(t("invalidOtp"));
      return;
    }

    const saved = localStorage.getItem("dnk-user-db");
    const users: User[] = saved ? JSON.parse(saved) : [];
    const idx = users.findIndex((u) => u.email === forgotEmail);

    if (idx >= 0) {
      users[idx].password = resetPassword;
      localStorage.setItem("dnk-user-db", JSON.stringify(users));
      setUser(users[idx]);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: "Client DNK",
        email: forgotEmail,
        password: resetPassword,
        role: "CUSTOMER",
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem("dnk-user-db", JSON.stringify(users));
      setUser(newUser);
    }

    closeAuthModal();
    toast.success(t("passwordReset"));
    resetForms();
    router.push("/account");
  };

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirm("");
    setForgotEmailInput("");
  };

  const inputClass =
    "w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20";

  // Utilisation d'un Portal pour injecter la modale tout à la fin du body
  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Conteneur global de centrage */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              {authMode !== "login" && authMode !== "register" && (
                <button
                  onClick={() => setAuthMode("login")}
                  className="mr-1 text-slate-500 hover:text-slate-900"
                  aria-label={t("back")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                {authMode === "login" && t("login")}
                {authMode === "register" && t("register")}
                {authMode === "verify" && t("verifyTitle")}
                {authMode === "forgot" && t("forgotTitle")}
                {authMode === "reset" && t("resetTitle")}
              </h2>
            </div>
            <button
              onClick={closeAuthModal}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
              aria-label={t("close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Corps de la modale */}
          <div className="p-5 sm:p-6">
            {authMode === "login" && (
              <form onSubmit={handleLogin} className="grid gap-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={t("email")}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t("password")}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                >
                  {t("login")}
                </button>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className="text-left text-sm font-bold text-brand-600 hover:underline"
                  >
                    {t("noAccount")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("forgot")}
                    className="text-left text-sm text-slate-500 underline hover:text-brand-600"
                  >
                    {t("forgotPassword")}
                  </button>
                </div>
                <p className="text-xs leading-5 text-slate-500">
                  {t("demoHint")}
                </p>
              </form>
            )}

            {authMode === "register" && (
              <form onSubmit={handleRegister} className="grid gap-4">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder={t("name")}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder={t("email")}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder={t("password")}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={registerConfirm}
                    onChange={(e) => setRegisterConfirm(e.target.value)}
                    placeholder={t("confirmPassword")}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                <label className="flex items-start gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                  />
                  <span>{t("acceptTerms")}</span>
                </label>
                <button
                  type="submit"
                  className="bg-brand-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                >
                  {t("createAccountBtn")}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-sm font-bold text-brand-600 hover:underline"
                >
                  {t("alreadyHaveAccount")}
                </button>
              </form>
            )}

            {authMode === "verify" && (
              <>
                <div className="text-sm leading-6 text-slate-600">
                  <p>{t("verifyDesc")}</p>
                  <p className="mt-2 font-bold text-brand-700">
                    {t("verifyDemo")}
                  </p>
                </div>
                <form onSubmit={handleVerify} className="mt-5 grid gap-4">
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={verifyOtp}
                    onChange={(e) =>
                      setVerifyOtp(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder={t("verifyCode")}
                    className={`${inputClass} text-center tracking-[.4em]`}
                  />
                  <button
                    type="submit"
                    className="bg-brand-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                  >
                    {t("verifyBtn")}
                  </button>
                </form>
                <button
                  onClick={() => setAuthMode("login")}
                  className="mt-4 text-sm text-slate-500 underline hover:text-brand-600"
                >
                  {t("backToLogin")}
                </button>
              </>
            )}

            {authMode === "forgot" && (
              <>
                <p className="text-sm leading-6 text-slate-600">
                  {t("forgotDesc")}
                </p>
                <form onSubmit={handleForgot} className="mt-5 grid gap-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={forgotEmailInput}
                      onChange={(e) => setForgotEmailInput(e.target.value)}
                      placeholder={t("email")}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-slate-900 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                  >
                    {t("sendCode")}
                  </button>
                </form>
                <button
                  onClick={() => setAuthMode("login")}
                  className="mt-4 text-sm text-slate-500 underline hover:text-brand-600"
                >
                  {t("backToLogin")}
                </button>
              </>
            )}

            {authMode === "reset" && (
              <>
                <p className="text-sm leading-6 text-slate-600">
                  {t("resetDemo")}
                </p>
                <form onSubmit={handleReset} className="mt-5 grid gap-4">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) =>
                      setResetOtp(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder={t("otpCode")}
                    className={`${inputClass} text-center tracking-[.4em]`}
                  />
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder={t("newPassword")}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
                  >
                    {t("changePassword")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
