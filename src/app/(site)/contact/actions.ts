"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/auth/rate-limit";
import { addEnquiry } from "@/lib/cms/store";
import { enquiryRoles } from "@/lib/site-data";

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

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!rateLimit(`enquiry:${ip}`, 5, 10 * 60_000).ok) {
    return {
      status: "error",
      message: "You've sent several enquiries in a short time. Please try again in a few minutes, or call us directly.",
    };
  }

  const fullName = field(form, "fullName", 120);
  const contact = field(form, "contact", 160);
  const message = field(form, "message", 4000);
  const roleLabel = field(form, "role", 60);
  const errors: EnquiryState["errors"] = {};
  if (!fullName) errors.fullName = "Please enter your full name.";
  if (!contact) errors.contact = "Please enter an email or phone number.";
  if (!message) errors.message = "Please enter your enquiry.";
  if (!form.get("consent")) errors.consent = "Please provide consent to continue.";
  if (Object.keys(errors).length) {
    return {
      status: "error",
      errors,
      values: { fullName, company: field(form, "company", 160), contact, message, consent: Boolean(form.get("consent")) },
    };
  }

  await addEnquiry({
    role: enquiryRoles.some((r) => r.label === roleLabel) ? roleLabel : "Not specified",
    name: fullName,
    company: field(form, "company", 160),
    contact,
    message,
  });
  revalidatePath("/admin", "layout");
  return { status: "success" };
}
