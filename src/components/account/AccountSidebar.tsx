"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  LogOut,
  Package,
  MapPin,
  ShoppingBag,
  MessageSquare
} from "lucide-react";
import { User } from "@/types";

// ✅ Ajout de "returns" dans le type
type TabType = "orders" | "addresses" | "returns";

interface AccountSidebarProps {
  user: User;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  handleLogout: () => void;
}

export default function AccountSidebar({
  user,
  activeTab,
  setActiveTab,
  handleLogout
}: AccountSidebarProps) {
  const t = useTranslations("account");

  const navItemClass = (isActive: boolean) =>
    `flex items-center gap-2 px-4 py-3 text-left font-bold transition rounded-none ${
      isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100"
    }`;

  return (
    <aside>
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
            {t("hello")}
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
            {user.name || "Client DNK"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 rounded-none text-sm font-bold text-red-600 transition hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>

      <nav className="grid gap-1 text-sm sm:gap-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={navItemClass(activeTab === "orders")}
        >
          <Package className="h-4 w-4" />
          {t("myOrders")}
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={navItemClass(activeTab === "addresses")}
        >
          <MapPin className="h-4 w-4" />
          {t("myAddresses")}
        </button>

        {/* ✅ NOUVEAU : Onglet Returns */}
        <button
          onClick={() => setActiveTab("returns")}
          className={navItemClass(activeTab === "returns")}
        >
          <ShoppingBag className="h-4 w-4" />
          {t("returns")}
        </button>

        <Link
          href="/contact"
          className="flex items-center gap-2 rounded-none px-4 py-3 font-bold transition hover:bg-slate-100"
        >
          <MessageSquare className="h-4 w-4" />
          {t("contact")}
        </Link>
      </nav>
    </aside>
  );
}
