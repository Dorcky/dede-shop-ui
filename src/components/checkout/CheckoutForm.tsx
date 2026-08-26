"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useCart } from "@/lib/store/useCart";
import { useOrders } from "@/lib/store/useOrders";
import { useSettings } from "@/lib/store/useSettings";
import { useAuth } from "@/lib/store/useAuth";
import { Order, OrderItem } from "@/types";
import { Lock, Info } from "lucide-react";

export default function CheckoutForm() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { items, getSubtotal, getShippingCost, clearCart, hasOnlyDigital } =
    useCart();
  const addOrder = useOrders((state) => state.addOrder);
  const settings = useSettings();
  const { user, openAuthModal } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onlyDigital = hasOnlyDigital();
  const subtotal = getSubtotal();
  const shipping = getShippingCost(
    settings.shipping.freeThreshold,
    settings.shipping.localCost
  );
  const total = subtotal + shipping;

  // ✅ Schéma unifié sans 'any'
  const schema = z
    .object({
      firstName: z.string().min(2, "Minimum 2 caractères"),
      lastName: z.string().min(2, "Minimum 2 caractères"),
      email: z.string().email("Email invalide"),
      phone: z.string().optional(),
      card: z.string().min(12, "Numéro de carte invalide"),
      expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/AA"),
      cvv: z.string().regex(/^\d{3,4}$/, "CVV invalide"),
      terms: z.boolean().refine((value) => value === true, {
        message: "Vous devez accepter les conditions"
      }),
      address: z.string().min(5, "Adresse trop courte").optional(),
      city: z.string().min(2, "Ville requise").optional(),
      province: z.string().min(2, "Province requise").optional(),
      postal: z.string().min(3, "Code postal requis").optional(),
      country: z.string().min(2, "Pays requis").optional()
    })
    .refine(
      (data) => {
        if (onlyDigital) return true;
        return (
          !!data.address &&
          !!data.city &&
          !!data.province &&
          !!data.postal &&
          !!data.country
        );
      },
      {
        message:
          "L'adresse de livraison est requise pour les produits physiques",
        path: ["address"]
      }
    );

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
    // ✅ 'reset' a été supprimé d'ici
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.productId,
        productSlug: item.productSlug,
        productName: { fr: item.name, en: item.name },
        variantName: item.variantName,
        quantity: item.quantity,
        price: item.price,
        isDigital: item.isDigital,
        image: item.image
      }));

      const newOrder: Order = {
        id: `DNK-${Math.floor(1000 + Math.random() * 8999)}`,
        userId: null,
        status: "CONFIRMED",
        total,
        shippingCost: shipping,
        discountAmount: 0,
        customerName: `${data.firstName} ${data.lastName}`,
        customerEmail: data.email,
        customerPhone: data.phone || null,
        address: onlyDigital ? "Numérique" : data.address || "N/A",
        city: onlyDigital ? "N/A" : data.city || "N/A",
        province: onlyDigital ? "N/A" : data.province || "N/A",
        postalCode: onlyDigital ? "N/A" : data.postal || "N/A",
        country: onlyDigital ? "N/A" : data.country || "N/A",
        items: orderItems,
        tracking: [
          {
            label: { fr: "Commande confirmée", en: "Order confirmed" },
            done: true,
            date: new Date().toLocaleDateString(),
            status: "CONFIRMED",
            location: "En attente de traitement",
            eta: null
          },
          {
            label: { fr: "Traitement", en: "Processing" },
            done: false,
            date: "",
            status: "PREPARING",
            location: null,
            eta: null
          },
          {
            label: { fr: "Expédiée / Livrée", en: "Shipped / Delivered" },
            done: false,
            date: "",
            status: "SHIPPED",
            location: null,
            eta: null
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addOrder(newOrder);
      clearCart();
      toast.success(t("orderConfirmed", { id: newOrder.id }));
      router.push("/account");
    } catch {
      // ✅ Remplacé 'error' par '_error'
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 sm:gap-8">
      {/* Informations de contact */}
      <div>
        <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-black text-slate-900">
            {t("contactInfo")}
          </h2>
          {user ? (
            <span className="text-sm text-slate-500">
              {t("loggedInAs")} <strong>{user.email}</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="text-left text-sm font-bold text-brand-600 hover:underline sm:text-right"
            >
              {t("login")}
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <div>
            <input
              {...register("firstName")}
              placeholder={t("firstName")}
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("lastName")}
              placeholder={t("lastName")}
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <input
              {...register("email")}
              type="email"
              placeholder={t("email")}
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <input
              {...register("phone")}
              placeholder={t("phone")}
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
        </div>
      </div>

      {/* Adresse de livraison (masquée si 100% numérique) */}
      {onlyDigital ? (
        <div className="flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{t("noAddressNeeded")}</p>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-xl font-black text-slate-900 sm:mb-5">
            {t("shippingAddress")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="sm:col-span-2">
              <input
                {...register("address")}
                placeholder={t("address")}
                className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("city")}
                placeholder={t("city")}
                className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("province")}
                placeholder={t("province")}
                className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
              {errors.province && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.province.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("postal")}
                placeholder={t("postal")}
                className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
              {errors.postal && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.postal.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...register("country")}
                className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="Canada">Canada</option>
                <option value="États-Unis">États-Unis</option>
                <option value="France">France</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Paiement */}
      <div>
        <h2 className="mb-4 text-xl font-black text-slate-900 sm:mb-5">
          {t("payment")}
        </h2>
        <div className="grid gap-3 sm:gap-4">
          <div>
            <input
              {...register("card")}
              inputMode="numeric"
              placeholder={t("cardNumber")}
              className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
            {errors.card && (
              <p className="mt-1 text-xs text-red-600">{errors.card.message}</p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <input
                {...register("expiry")}
                placeholder={t("expiry")}
                className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
              {errors.expiry && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.expiry.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("cvv")}
                placeholder={t("cvv")}
                className="w-full border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
              {errors.cvv && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.cvv.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs text-slate-500 sm:mt-4">
          <Lock className="mt-0.5 h-3 w-3 shrink-0" />
          {t("demo")}
        </p>
      </div>

      {/* Conditions */}
      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          {...register("terms")}
          className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
        />
        <span>{t("terms")}</span>
      </label>
      {errors.terms && (
        <p className="-mt-2 text-xs text-red-600">{errors.terms.message}</p>
      )}

      {/* Bouton confirmer */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-600 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:py-4"
      >
        {isSubmitting
          ? t("processing")
          : `${t("confirm")} — ${total.toFixed(2)} $`}
      </button>
    </form>
  );
}
