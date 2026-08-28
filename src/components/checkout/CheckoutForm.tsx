"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useCart } from "@/lib/store/useCart";
import { useOrders } from "@/lib/store/useOrders";
import { useAuth } from "@/lib/store/useAuth";
import { useAddresses } from "@/lib/store/useAddresses";
import { Order, OrderItem, TaxCalculation } from "@/types";
import { Lock, Info } from "lucide-react";

interface CheckoutFormProps {
  onTaxCalculated: (taxData: TaxCalculation) => void;
}

export default function CheckoutForm({ onTaxCalculated }: CheckoutFormProps) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { items, getSubtotal, clearCart, hasOnlyDigital } = useCart();
  const addOrder = useOrders((state) => state.addOrder);
  const { user, openAuthModal } = useAuth();
  const { addresses } = useAddresses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taxData, setTaxData] = useState<TaxCalculation | null>(null); // ✅ état local pour afficher le total

  const onlyDigital = hasOnlyDigital();
  const subtotal = getSubtotal();

  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  const schema = z
    .object({
      firstName: z.string().min(2, "Minimum 2 caractères"),
      lastName: z.string().min(2, "Minimum 2 caractères"),
      email: z.string().email("Email invalide"),
      phone: z.string().optional(),
      address: z.string().min(5, "Adresse trop courte").optional(),
      city: z.string().min(2, "Ville requise").optional(),
      province: z.string().min(2, "Province requise").optional(),
      postal: z.string().min(3, "Code postal requis").optional(),
      country: z.string().min(2, "Pays requis"),
      shippingMethod: z.string(),
      card: z.string().min(12, "Numéro de carte invalide"),
      expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/AA"),
      cvv: z.string().regex(/^\d{3,4}$/, "CVV invalide"),
      terms: z
        .boolean()
        .refine((value) => value === true, {
          message: "Vous devez accepter les conditions"
        })
    })
    .refine(
      (data) => {
        if (onlyDigital) return true;
        return (
          !!data.address && !!data.city && !!data.province && !!data.postal
        );
      },
      {
        message: "L'adresse est requise pour les produits physiques",
        path: ["address"]
      }
    );

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName:
        user?.name?.split(" ")[0] || defaultAddr?.fullName?.split(" ")[0] || "",
      lastName:
        user?.name?.split(" ").slice(1).join(" ") ||
        defaultAddr?.fullName?.split(" ").slice(1).join(" ") ||
        "",
      email: user?.email || "",
      phone: defaultAddr?.phone || "",
      address: defaultAddr?.addressLine1 || "",
      city: defaultAddr?.city || "",
      province: defaultAddr?.province || "QC",
      postal: defaultAddr?.postalCode || "",
      country: defaultAddr?.country || "Canada",
      shippingMethod: "standard"
    }
  });

  const watchedCountry = watch("country");
  const watchedProvince = watch("province");
  const watchedShipping = watch("shippingMethod");

  // ✅ Calcul des taxes et mise à jour de l'état local
  useEffect(() => {
    if (!onlyDigital && watchedCountry && watchedProvince) {
      const shippingCost = watchedShipping === "express" ? 15.0 : 0;

      fetch("/api/taxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtotal,
          shipping: shippingCost,
          country: watchedCountry,
          province: watchedProvince
        })
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Erreur API");
          const data = await res.json();
          setTaxData(data); // ✅ mise à jour locale
          onTaxCalculated(data); // ✅ propagation au parent
        })
        .catch((err) => {
          console.error("❌ Échec du calcul des taxes :", err);
        });
    }
  }, [
    watchedCountry,
    watchedProvince,
    watchedShipping,
    subtotal,
    onlyDigital,
    onTaxCalculated
  ]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const shippingCost = data.shippingMethod === "express" ? 15.0 : 0;
      const res = await fetch("/api/taxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtotal,
          shipping: shippingCost,
          country: data.country,
          province: data.province
        })
      });
      const taxDataRes: TaxCalculation = await res.json();

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
        userId: user?.id || null,
        status: "CONFIRMED",
        total: taxDataRes.grandTotal,
        shippingCost: shippingCost,
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
            location: "En attente",
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
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-none border border-slate-300 px-4 py-3 text-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20";
  const labelClass =
    "mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-6 pb-24 sm:gap-8 lg:pb-0"
    >
      {/* Contact Info */}
      <div>
        <div className="mb-4 sm:mb-5">
          <h2 className="text-xl font-black text-slate-900">
            {t("contactInfo")}
          </h2>
          {user ? (
            <p className="mt-1 text-sm text-slate-500">
              {t("loggedInAs")} <strong>{user.email}</strong>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="mt-1 text-left text-sm font-bold text-brand-600 hover:underline"
            >
              {t("login")}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div>
            <label className={labelClass}>{t("firstName")}</label>
            <input {...register("firstName")} className={inputClass} />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>{t("lastName")}</label>
            <input {...register("lastName")} className={inputClass} />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>{t("email")}</label>
            <input {...register("email")} type="email" className={inputClass} />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>
              {t("phone")}{" "}
              <span className="font-normal normal-case text-slate-400">
                (optionnel)
              </span>
            </label>
            <input {...register("phone")} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Shipping Address & Method */}
      {!onlyDigital ? (
        <div>
          <h2 className="mb-4 text-xl font-black text-slate-900 sm:mb-5">
            {t("shippingAddress")}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>{t("address")}</label>
              <input {...register("address")} className={inputClass} />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>{t("city")}</label>
              <input {...register("city")} className={inputClass} />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>{t("province")}</label>
              <input {...register("province")} className={inputClass} />
              {errors.province && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.province.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>{t("postal")}</label>
              <input {...register("postal")} className={inputClass} />
              {errors.postal && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.postal.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>{t("country")}</label>
              <select {...register("country")} className={inputClass}>
                <option value="Canada">Canada</option>
                <option value="États-Unis">États-Unis</option>
                <option value="France">France</option>
              </select>
            </div>

            <div className="mt-2 sm:col-span-2">
              <label className={labelClass}>{t("shippingMethod")}</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 border p-3 transition ${watchedShipping === "standard" ? "border-brand-600 bg-brand-50" : "border-slate-300 hover:bg-slate-50"}`}
                >
                  <input
                    type="radio"
                    value="standard"
                    {...register("shippingMethod")}
                    className="accent-brand-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {t("standard")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t("standardDesc")}
                    </p>
                  </div>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 border p-3 transition ${watchedShipping === "express" ? "border-brand-600 bg-brand-50" : "border-slate-300 hover:bg-slate-50"}`}
                >
                  <input
                    type="radio"
                    value="express"
                    {...register("shippingMethod")}
                    className="accent-brand-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {t("express")}
                    </p>
                    <p className="text-xs text-slate-500">{t("expressDesc")}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{t("noAddressNeeded")}</p>
        </div>
      )}

      {/* Payment */}
      <div>
        <h2 className="mb-4 text-xl font-black text-slate-900 sm:mb-5">
          {t("payment")}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div>
            <label className={labelClass}>{t("cardNumber")}</label>
            <input
              {...register("card")}
              inputMode="numeric"
              className={inputClass}
            />
            {errors.card && (
              <p className="mt-1 text-xs text-red-600">{errors.card.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={labelClass}>{t("expiry")}</label>
              <input
                {...register("expiry")}
                placeholder="MM/AA"
                className={inputClass}
              />
              {errors.expiry && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.expiry.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>{t("cvv")}</label>
              <input
                {...register("cvv")}
                inputMode="numeric"
                placeholder="123"
                className={inputClass}
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

      {/* Terms */}
      <label className="-mx-2 flex cursor-pointer items-start gap-3 p-2">
        <input
          type="checkbox"
          {...register("terms")}
          className="mt-1 h-5 w-5 shrink-0 accent-brand-600"
        />
        <span className="text-sm leading-5 text-slate-700">{t("terms")}</span>
      </label>
      {errors.terms && (
        <p className="-mt-2 px-2 text-xs text-red-600">
          {errors.terms.message}
        </p>
      )}

      {/* Submit Button avec affichage du total TTC */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:static lg:border-0 lg:p-0 lg:shadow-none">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-600 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? t("processing")
            : `${t("confirm")} — ${taxData?.grandTotal?.toFixed(2) ?? "..."} $`}
        </button>
      </div>
    </form>
  );
}
