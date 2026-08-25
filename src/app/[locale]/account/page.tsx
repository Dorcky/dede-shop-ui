"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/store/useAuth";
import { useOrders } from "@/lib/store/useOrders";
import { ShoppingBag, LogOut, ChevronRight } from "lucide-react";
import type { Order } from "@/types";
import OrderDetailModal from "@/components/order/OrderDetailModal";

export default function AccountPage() {
  const t = useTranslations("account");
  const router = useRouter();
  const { user, logout, openAuthModal } = useAuth();
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  // ====== NON CONNECTÉ ======
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
              Créez un compte pour consulter vos commandes, suivre vos
              livraisons, gérer vos retours et enregistrer vos informations.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <button
                onClick={() => openAuthModal("login")}
                className="bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 sm:px-6"
              >
                {t("login")}
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="border border-slate-300 px-5 py-3 text-xs font-bold uppercase tracking-wider transition hover:border-slate-900 sm:px-6"
              >
                {t("createAccount")}
              </button>
            </div>
          </div>
          <div className="rounded-lg bg-brand-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">{t("guest")}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {t("guestDesc")}
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block text-sm font-bold text-brand-700 hover:underline sm:mt-6"
            >
              {t("guestBtn")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ====== CONNECTÉ ======
  const userOrders = orders.filter(
    (o) => o.userId === user.id || o.customerEmail === user.email
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:pb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-brand-600">
            {t("hello")}
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
            {user.name || "Client DNK"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:mt-2">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-left text-sm font-bold text-red-600 transition hover:text-red-700 sm:text-right"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>

      {/* Grille */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-12">
        {/* Sidebar */}
        <aside>
          <nav className="grid gap-1 text-sm sm:gap-2">
            <button className="bg-slate-900 px-4 py-3 text-left font-bold text-white">
              {t("myOrders")}
            </button>
            <button
              onClick={() => toast.info("Fonctionnalité à venir")}
              className="px-4 py-3 text-left font-bold transition hover:bg-slate-100"
            >
              {t("myComplaints")}
            </button>
            <Link
              href="/returns"
              className="px-4 py-3 font-bold transition hover:bg-slate-100"
            >
              {t("returns")}
            </Link>
            <Link
              href="/contact"
              className="px-4 py-3 font-bold transition hover:bg-slate-100"
            >
              {t("contact")}
            </Link>
          </nav>
        </aside>

        {/* Contenu principal */}
        <div>
          <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-black text-slate-900">
              {t("orderHistory")}
            </h2>
            <span className="text-sm text-slate-500">
              {userOrders.length} {t("orderCount")}
            </span>
          </div>

          {userOrders.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {userOrders.map((order) => (
                <OrderRow
                  key={order.id || order.createdAt}
                  order={order}
                  getStatusLabel={getStatusLabel}
                  t={t}
                  onSelect={setSelectedOrder} // ✅ Correction ici
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-16 text-center sm:py-20">
              <ShoppingBag className="h-12 w-12 text-slate-300" />
              <p className="mt-4 font-bold text-slate-900">{t("noOrders")}</p>
              <Link
                href="/shop"
                className="mt-3 text-sm font-bold text-brand-600 hover:underline sm:mt-4"
              >
                {t("startShopping")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détail de commande */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </section>
  );
}

// ====== Composant OrderRow ======
// Vers la ligne 190, remplacez :
function OrderRow({
  order,
  getStatusLabel,
  t, // <-- Changez le type ici
  onSelect
}: {
  order: Order;
  getStatusLabel: (s: string) => string;
  t: (key: string) => string; // ✅ Remplacez 'any' par ceci
  onSelect: (order: Order) => void;
}) {
  return (
    <button
      onClick={() => onSelect(order)}
      className="flex w-full flex-col gap-3 py-4 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-6"
    >
      <div>
        <p className="font-bold text-slate-900">{order.id}</p>
        <p className="mt-0.5 text-sm text-slate-500 sm:mt-1">
          {new Date(order.createdAt).toLocaleDateString()} ·{" "}
          {order.items.length} {t("articleCount")}
        </p>
      </div>
      <div className="sm:text-right">
        <p className="font-bold text-slate-900">{order.total.toFixed(2)} $</p>
        <p className="mt-0.5 text-sm font-semibold text-brand-600 sm:mt-1">
          {getStatusLabel(order.status)}
        </p>
      </div>
      <ChevronRight className="hidden h-5 w-5 text-slate-400 sm:block" />
    </button>
  );
}
