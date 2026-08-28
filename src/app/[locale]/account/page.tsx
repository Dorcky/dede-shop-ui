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
import ReturnsForm from "@/components/returns/ReturnsForm"; // ✅ AJOUT
import SecurityManager from "@/components/account/SecurityManager";
import FavoritesList from "@/components/account/FavoritesList";

type TabType = "orders" | "addresses" | "returns" | "security" | "favorites";

export default function AccountPage() {
  const t = useTranslations("account");
  const locale = useLocale();
  const tReview = useTranslations("review");
  const tContact = useTranslations("contact");
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, logout, openAuthModal } = useAuth();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

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
        i.productName.fr.toLowerCase().includes(searchQuery.toLowerCase())
      ); // Fallback fr pour simplifier la recherche
    const orderYear = new Date(order.createdAt).getFullYear().toString();
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
                onClick={() => openAuthModal("login")}
                className="rounded-none bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:px-6"
              >
                {t("login")}
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="rounded-none border border-slate-300 px-5 py-3 text-xs font-bold uppercase tracking-wider transition hover:border-slate-900 sm:px-6"
              >
                {t("createAccount")}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-12">
        {/* ✅ SIDEBAR SÉPARÉE */}
        <AccountSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />

        {/* ✅ CONTENU PRINCIPAL DYNAMIQUE */}
        <div>
          {activeTab === "orders" ? (
            <>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-black text-slate-900">
                  {t("myOrders")}
                </h2>
                <div className="relative flex-1 sm:max-w-md">
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
              </div>

              <div className="mb-6 flex items-center gap-2 text-sm">
                <span className="font-bold text-slate-900">
                  {filteredOrders.length} commande(s)
                </span>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="rounded-none border border-slate-300 bg-slate-50 px-3 py-1 text-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="all">Toutes les années</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>

              {filteredOrders.length > 0 ? (
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-none border border-slate-300 bg-white shadow-sm"
                    >
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-300 bg-slate-50 p-4 text-xs text-slate-700 md:grid-cols-4">
                        <div>
                          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                            Commandée le
                          </span>
                          <span className="font-medium text-slate-900">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                            Total
                          </span>
                          <span className="font-bold text-slate-900">
                            {order.total.toFixed(2)} $
                          </span>
                        </div>
                        <div>
                          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                            Expédié à
                          </span>
                          <span className="font-medium text-slate-900">
                            {order.customerName}
                          </span>
                        </div>
                        <div className="text-right md:text-right">
                          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                            N° de commande
                          </span>
                          <span className="font-medium text-slate-900">
                            {order.id}
                          </span>
                          <div className="mt-1">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="rounded-none text-brand-600 hover:underline"
                            >
                              Voir les détails
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="mb-4 text-lg font-bold text-slate-900">
                          {getStatusLabel(order.status)}
                        </p>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col gap-4 md:flex-row md:items-start ${idx > 0 ? "border-t border-slate-200 pt-6" : ""}`}
                          >
                            <div className="flex flex-1 gap-4">
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-none border border-slate-200 bg-slate-50">
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.productName.fr}
                                    width={80}
                                    height={80}
                                    className="h-full w-full rounded-none object-cover"
                                  />
                                ) : (
                                  <Package className="h-8 w-8 text-slate-300" />
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <p className="text-sm font-medium text-slate-900">
                                  <Link
                                    href={`/product/${item.productSlug}`}
                                    className="text-brand-600 hover:underline"
                                  >
                                    {item.productName.fr}
                                  </Link>
                                </p>
                                <p className="text-xs text-slate-500">
                                  Variante : {item.variantName} | Qté :{" "}
                                  {item.quantity}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Retour éligible jusqu&apos;au{" "}
                                  {getReturnDate(order.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex w-full flex-col gap-2 text-sm md:w-56 md:shrink-0">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-xs font-medium transition hover:bg-slate-50"
                              >
                                {t("tracking") || "Suivre le colis"}
                              </button>
                              <Link
                                href={`/returns?orderId=${order.id}&productId=${item.productId}`}
                                className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-center text-xs font-medium transition hover:bg-slate-50"
                              >
                                {t("returnRequest") || "Retourner"}
                              </Link>
                              <Link
                                href={`/product/${item.productSlug}#reviews`}
                                className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-center text-xs font-medium transition hover:bg-slate-50"
                              >
                                {tReview("leave") || "Écrire un avis"}
                              </Link>
                              <Link
                                href="/contact"
                                className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-center text-xs font-medium transition hover:bg-slate-50"
                              >
                                {tContact("title") || "Aide"}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
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
          ) : activeTab === "addresses" ? (
            // ✅ RENDU DU GESTIONNAIRE D'ADRESSES
            <AddressManager />
          ) : activeTab === "returns" ? (
            // ✅ RENDU DU FORMULAIRE DE RETOUR (avec la locale actuelle)
            <ReturnsForm locale={locale as "fr" | "en"} />
          ) : activeTab === "favorites" ? (
            <FavoritesList />
          ) : (
            <SecurityManager /> // ✅ NOUVEAU RENDU
          )}
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
