"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAddresses, Address } from "@/lib/store/useAddresses";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function AddressManager() {
  const t = useTranslations("account");
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useAddresses();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);

  const initialFormState = {
    country: "Canada",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    postalCode: "",
    isDefault: false,
    propertyType: undefined as Address["propertyType"],
    securityCode: "",
    callBox: "",
    keyFobRequired: false,
    leavePackageLocation: undefined as Address["leavePackageLocation"],
    deliveryNotes: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsFormOpen(false);
    setShowOptionalDetails(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAddress(editingId, formData);
      toast.success(t("addressSaved"));
    } else {
      addAddress(formData);
      toast.success(t("addressSaved"));
    }
    resetForm();
  };

  const handleEdit = (addr: Address) => {
    setFormData({
      country: addr.country || "Canada",
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      province: addr.province,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
      propertyType: addr.propertyType,
      securityCode: addr.securityCode || "",
      callBox: addr.callBox || "",
      keyFobRequired: addr.keyFobRequired || false,
      leavePackageLocation: addr.leavePackageLocation,
      deliveryNotes: addr.deliveryNotes || ""
    });
    setEditingId(addr.id);
    setIsFormOpen(true);
    if (addr.propertyType || addr.deliveryNotes) {
      setShowOptionalDetails(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?")) {
      deleteAddress(id);
      toast.success(t("addressDeleted"));
    }
  };

  const inputClass =
    "w-full border border-slate-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none rounded-none";
  const labelClass =
    "mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700";
  const radioClass = "mr-2 accent-brand-600";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black text-slate-900">
          {t("myAddresses")}
        </h2>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 rounded-none bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            {t("addAddress")}
          </button>
        )}
      </div>

      {/* Formulaire d'ajout / modification */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-none border border-slate-300 bg-white p-5 shadow-sm sm:p-6"
        >
          <h3 className="mb-6 border-b border-slate-200 pb-2 text-lg font-bold text-slate-900">
            {editingId ? t("editAddress") : t("addAddressBtn")}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Pays */}
            <div className="sm:col-span-2">
              <label className={labelClass}>{t("country")}</label>
              <select
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className={inputClass}
              >
                <option value="Canada">Canada</option>
                <option value="France">France</option>
                <option value="United States">United States</option>
              </select>
            </div>

            {/* Nom complet */}
            <div className="sm:col-span-2">
              <label className={labelClass}>{t("fullName")}</label>
              <input
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={inputClass}
              />
            </div>

            {/* Téléphone */}
            <div className="sm:col-span-2">
              <label className={labelClass}>{t("phone")}</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={inputClass}
              />
              <p className="mt-1 text-xs text-slate-500">{t("phoneHint")}</p>
            </div>

            {/* Adresse Ligne 1 */}
            <div className="sm:col-span-2">
              <label className={labelClass}>{t("addressLine1")}</label>
              <input
                required
                value={formData.addressLine1}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine1: e.target.value })
                }
                className={inputClass}
              />
            </div>

            {/* Adresse Ligne 2 */}
            <div className="sm:col-span-2">
              <label className={labelClass}>{t("addressLine2")}</label>
              <input
                value={formData.addressLine2}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine2: e.target.value })
                }
                className={inputClass}
              />
            </div>

            {/* Ville, Province, Code Postal */}
            <div>
              <label className={labelClass}>{t("city")}</label>
              <input
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("province")}</label>
              <select
                required
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
                className={inputClass}
              >
                <option value="">{t("provinceSelect")}</option>
                <option value="QC">Québec</option>
                <option value="ON">Ontario</option>
                <option value="BC">British Columbia</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t("postalCode")}</label>
              <input
                required
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
                className={inputClass}
              />
            </div>

            {/* Adresse par défaut */}
            <div className="mt-2 sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="h-4 w-4 rounded-none accent-brand-600"
                />
                <span className="text-sm font-medium text-slate-700">
                  {t("makeDefault")}
                </span>
              </label>
            </div>
          </div>

          {/* Bouton pour afficher/masquer les détails optionnels */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setShowOptionalDetails(!showOptionalDetails)}
              className="flex items-center gap-2 text-sm font-bold text-brand-600 transition hover:text-brand-700"
            >
              {showOptionalDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {showOptionalDetails
                ? t("showFewerOptions")
                : t("deliveryInstructionsSubtitle")}
            </button>
          </div>

          {/* Section Optionnelle Repliable */}
          {showOptionalDetails && (
            <div className="animate-in fade-in slide-in-from-top-2 mt-4 grid gap-5 duration-300">
              {/* Type de propriété */}
              <div>
                <p className={`${labelClass} mb-2`}>{t("propertyType")}</p>
                <div className="flex flex-wrap gap-4">
                  {(["house", "apartment", "business", "other"] as const).map(
                    (type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="radio"
                          name="propertyType"
                          value={type}
                          checked={formData.propertyType === type}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyType: e.target
                                .value as Address["propertyType"]
                            })
                          }
                          className={radioClass}
                        />
                        {t(
                          `prop${type.charAt(0).toUpperCase() + type.slice(1)}`
                        )}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Immeuble à logements multiples */}
              <div className="border-l-2 border-slate-200 pl-4">
                <p className="mb-3 text-sm font-bold text-slate-900">
                  {t("multiUnitTitle")}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-slate-600">
                      {t("securityCode")}
                    </label>
                    <input
                      value={formData.securityCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          securityCode: e.target.value
                        })
                      }
                      placeholder={t("securityCodeHint")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-slate-600">
                      {t("callBox")}
                    </label>
                    <input
                      value={formData.callBox}
                      onChange={(e) =>
                        setFormData({ ...formData, callBox: e.target.value })
                      }
                      placeholder={t("callBoxHint")}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.keyFobRequired}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            keyFobRequired: e.target.checked
                          })
                        }
                        className="h-4 w-4 rounded-none accent-brand-600"
                      />
                      <span className="text-sm text-slate-700">
                        {t("keyFobRequired")}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Où laisser les colis */}
              <div>
                <p className={`${labelClass} mb-2`}>{t("leavePackageTitle")}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      "front_door",
                      "reception",
                      "mailroom",
                      "no_preference"
                    ] as const
                  ).map((loc) => (
                    <label
                      key={loc}
                      className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                    >
                      <input
                        type="radio"
                        name="leavePackage"
                        value={loc}
                        checked={formData.leavePackageLocation === loc}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leavePackageLocation: e.target
                              .value as Address["leavePackageLocation"]
                          })
                        }
                      />
                      {t(
                        `leave${loc
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join("")}`
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructions supplémentaires */}
              <div>
                <p className={`${labelClass} mb-2`}>
                  {t("additionalInstructions")}
                </p>
                <label className="mb-1 block text-xs text-slate-600">
                  {t("deliveryNotes")}
                </label>
                <textarea
                  rows={3}
                  value={formData.deliveryNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryNotes: e.target.value })
                  }
                  placeholder={t("deliveryNotesPlaceholder")}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="mt-8 flex gap-3 border-t border-slate-200 pt-6">
            <button
              type="submit"
              className="rounded-none bg-brand-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
            >
              {editingId ? t("saveAddressBtn") : t("addAddressBtn")}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-none border border-slate-300 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {/* Liste des adresses (Affichage) */}
      {addresses.length === 0 && !isFormOpen ? (
        <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <p className="mt-4 font-bold text-slate-900">{t("noAddresses")}</p>
          <p className="mt-1 text-sm text-slate-500">{t("noAddressesDesc")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative rounded-none border p-5 transition ${addr.isDefault ? "border-brand-600 bg-brand-50/30" : "border-slate-300 bg-white"}`}
            >
              {addr.isDefault && (
                <span className="absolute right-3 top-3 flex items-center gap-1 text-[10px] font-bold uppercase text-brand-700">
                  <CheckCircle className="h-3 w-3" /> {t("defaultAddress")}
                </span>
              )}
              <p className="font-bold text-slate-900">{addr.fullName}</p>
              <p className="mt-1 text-sm text-slate-700">{addr.addressLine1}</p>
              {addr.addressLine2 && (
                <p className="text-sm text-slate-600">{addr.addressLine2}</p>
              )}
              <p className="text-sm text-slate-600">
                {addr.city}, {addr.province} {addr.postalCode}
              </p>
              <p className="mt-1 text-sm text-slate-600">📞 {addr.phone}</p>

              {addr.deliveryNotes && (
                <div className="mt-3 rounded-sm bg-slate-100 p-2 text-xs italic text-slate-600">
                  📝 {addr.deliveryNotes}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200 pt-3">
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-xs font-bold text-brand-600 hover:underline"
                  >
                    {t("setAsDefault")}
                  </button>
                )}
                <button
                  onClick={() => handleEdit(addr)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <Pencil className="h-3 w-3" /> {t("editAddress")}
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" /> {t("deleteAddress")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
