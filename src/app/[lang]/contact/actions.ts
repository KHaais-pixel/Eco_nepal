"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/auth/rate-limit";
import { addEnquiry } from "@/lib/cms/store";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import en from "@/i18n/dictionaries/en";
import ne from "@/i18n/dictionaries/ne";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"fullName" | "contact" | "message" | "consent", string>>;
  // Echoed back on error: React resets form fields after an action, so the
  // form re-fills from these instead of wiping what the visitor typed.
  values?: { fullName: string; company: string; contact: string; message: string; consent: boolean };
};

const field = (form: FormData, key: string, max: number) => {
  const v = form.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
};

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: real visitors never see this field; bots fill it. Pretend success.
  if (field(form, "website", 200)) return { status: "success" };

  // Messages come back in the language of the page the form was on.
  const lang = field(form, "lang", 5);
  const t = (isLocale(lang) ? lang : DEFAULT_LOCALE) === "ne" ? ne : en;
  const msg = t.contact.form.errors;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!rateLimit(`enquiry:${ip}`, 5, 10 * 60_000).ok) {
    return { status: "error", message: msg.rate };
  }

  const fullName = field(form, "fullName", 120);
  const contact = field(form, "contact", 160);
  const message = field(form, "message", 4000);
  const roleKey = field(form, "role", 20);
  const errors: EnquiryState["errors"] = {};
  if (!fullName) errors.fullName = msg.fullName;
  if (!contact) errors.contact = msg.contact;
  if (!message) errors.message = msg.message;
  if (!form.get("consent")) errors.consent = msg.consent;
  if (Object.keys(errors).length) {
    return {
      status: "error",
      errors,
      values: { fullName, company: field(form, "company", 160), contact, message, consent: Boolean(form.get("consent")) },
    };
  }

  // The admin panel is in English, so store the English role label.
  const role = en.contact.form.roles.find((r) => r.key === roleKey)?.label ?? "Not specified";
  await addEnquiry({
    role,
    name: fullName,
    company: field(form, "company", 160),
    contact,
    message,
  });
  revalidatePath("/admin", "layout");
  return { status: "success" };
}
