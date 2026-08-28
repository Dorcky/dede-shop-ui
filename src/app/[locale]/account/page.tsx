"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/store/useAuth";
import { useOrders } from "@/lib/store/useOrders";
import { ShoppingBag, Search, Package } from "lucide-react";
import Image from "next/image";
import type { Order } from "@/types";
import OrderDetailModal from "@/components/order/OrderDetailModal";
import AccountSidebar from "@/components/account/AccountSidebar";
import AddressManager from "@/components/account/AddressManager";
import ReturnsForm from "@/components/returns/ReturnsForm";
import SecurityManager from "@/components/account/SecurityManager";
import FavoritesList from "@/components/account/FavoritesList";

type TabType = "orders" | "addresses" | "returns" | "security" | "favorites";

const tabs = [
  { id: "orders", icon: "📦", labelKey: "myOrders" },
  { id: "addresses", icon: "📍", labelKey: "myAddresses" },
  { id: "returns", icon: "↩️", labelKey: "returns" },
  { id: "favorites", icon: "❤️", labelKey: "favorites" },
  { id: "security", icon: "🔒", labelKey: "loginSecurity" }
];

export default function AccountPage() {
  const t = useTranslations("account");
  const locale = useLocale() as "fr" | "en";
  const tReview = useTranslations("review");
  const tContact = useTranslations("contact");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");

  const activeTab = (searchParams.get("tab") as TabType) || "orders";

  const setActiveTab = (tab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/account?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Vous êtes maintenant déconnecté.");
    router.push("/");
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      CONFIRMED: t("confirmed"),
      PREPARING: t("preparing"),
      SHIPPED: t("shipped"),
      IN_TRANSIT: t("inTransit"),
      DELIVERED: t("delivered"),
      CANCELLED: t("cancelled")
    };
    return map[status] || status;
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(
      locale === "fr" ? "fr-FR" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  const getReturnDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);
    return formatDate(date.toISOString());
  };

  const userOrders = orders.filter(
    (o) => o.userId === user?.id || o.customerEmail === user?.email
  );
  const filteredOrders = userOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) =>
        i.productName[locale].toLowerCase().includes(searchQuery.toLowerCase())
      );
    const orderYear = new Date(order.createdAt).getFullYear().toString();
    // ✅ Correction : comparer yearFilter avec orderYear
    return matchesSearch && (yearFilter === "all" || orderYear === yearFilter);
  });

  if (!user) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
              {t("subtitle")}
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 leading-7 text-slate-600 sm:mt-5">
              Créez un compte pour consulter vos commandes et gérer vos
              adresses.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <button
                onClick={() => (window.location.href = "/account?login=true")}
                className="rounded-none bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:px-6"
              >
                {t("login")}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-12">
      {/* Navigation mobile par onglets */}
      <div className="mb-6 lg:hidden">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-none border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab.id
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <span>{tab.icon}</span>
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-12">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block">
          <AccountSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
          />
        </div>

        {/* Contenu principal */}
        <div>
          {activeTab === "orders" && (
            <>
              {/* Recherche et Filtre */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                  {t("myOrders")}
                </h2>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <div className="relative flex-1 sm:max-w-xs">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="search"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-none border border-slate-300 py-2 pl-10 pr-3 text-sm transition focus:border-brand-600 focus:outline-none"
                    />
                  </div>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full rounded-none border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none sm:w-auto"
                  >
                    <option value="all">
                      {t("allYears") || "Toutes les années"}
                    </option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="overflow-hidden border border-slate-300 bg-white shadow-sm"
                    >
                      {/* En-tête commande : statut + détails */}
                      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          {getStatusLabel(order.status)}
                        </span>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-bold text-brand-600 hover:underline"
                        >
                          Détails commande →
                        </button>
                      </div>

                      {/* Corps commande : version horizontale moderne */}
                      <div className="p-4">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col gap-3 ${idx > 0 ? "mt-4 border-t border-slate-100 pt-4" : ""}`}
                          >
                            {/* Alignement horizontal : image miniature à gauche */}
                            <div className="flex items-start gap-3">
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-slate-200 bg-slate-50">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.productName[locale]}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <Package className="h-6 w-6 text-slate-300" />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1 text-left">
                                <Link
                                  href={`/product/${item.productSlug}`}
                                  className="line-clamp-1 text-sm font-bold text-slate-900 hover:text-brand-600"
                                >
                                  {item.productName[locale]}
                                </Link>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {item.variantName} • Qté : {item.quantity}
                                </p>
                                <p className="mt-1 text-[11px] text-slate-400">
                                  Retour jusqu&apos;au{" "}
                                  {getReturnDate(order.createdAt)}
                                </p>
                              </div>
                            </div>

                            {/* Boutons hiérarchisés : principal, secondaire, liens */}
                            <div className="mt-1 flex flex-wrap gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="flex-1 bg-slate-900 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-slate-800"
                              >
                                {t("tracking") || "Suivre"}
                              </button>

                              <Link
                                href={`/returns?orderId=${order.id}&productId=${item.productId}`}
                                className="flex-1 border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                {t("returnRequest") || "Retourner"}
                              </Link>

                              <div className="flex w-full justify-between pt-1 text-[11px]">
                                <Link
                                  href={`/product/${item.productSlug}#reviews`}
                                  className="font-medium text-slate-500 hover:text-slate-900 hover:underline"
                                >
                                  ★ {tReview("leave") || "Laisser un avis"}
                                </Link>
                                <Link
                                  href="/contact"
                                  className="font-medium text-slate-500 hover:text-slate-900 hover:underline"
                                >
                                  {tContact("title") || "Aide"}
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                  <ShoppingBag className="h-12 w-12 text-slate-300" />
                  <p className="mt-4 font-bold text-slate-900">
                    {t("noOrders")}
                  </p>
                  <Link
                    href="/shop"
                    className="mt-3 text-sm font-bold text-brand-600 hover:underline sm:mt-4"
                  >
                    {t("startShopping")}
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Rendu des autres onglets */}
          {activeTab === "addresses" && <AddressManager />}
          {activeTab === "returns" && <ReturnsForm locale={locale} />}
          {activeTab === "favorites" && <FavoritesList />}
          {activeTab === "security" && <SecurityManager />}
        </div>
      </div>

      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </section>
  );
}
