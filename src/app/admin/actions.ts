"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/auth/dal";
import { verifyPassword } from "@/lib/auth/password";
import { clearRateLimit, rateLimit } from "@/lib/auth/rate-limit";
import { createSession, deleteSession, isAuthConfigured } from "@/lib/auth/session";
import { deleteEnquiry, setEnquiryStatus, updateContent } from "@/lib/cms/store";
import { ENQUIRY_STATUSES, type EnquiryStatus } from "@/lib/cms/types";
import { deleteUpload, saveUpload, UploadError } from "@/lib/cms/uploads";

export type ActionState = { status: "idle" | "success" | "error"; message?: string };

const ok = (message: string): ActionState => ({ status: "success", message });
const fail = (message: string): ActionState => ({ status: "error", message });

// ---- form helpers -----------------------------------------------------------

function text(form: FormData, key: string, max = 300): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function lines(form: FormData, key: string, maxItems = 50, maxLen = 200): string[] {
  return text(form, key, maxItems * (maxLen + 2))
    .split(/\r?\n/)
    .map((l) => l.trim().slice(0, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

function paragraphs(form: FormData, key: string): string[] {
  return text(form, key, 8000)
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean)
    .slice(0, 12);
}

function file(form: FormData, key: string): File | null {
  const value = form.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Admin changes appear on the public site immediately. */
function refreshSite() {
  revalidatePath("/", "layout");
}

async function guarded(run: () => Promise<ActionState>): Promise<ActionState> {
  await verifyAdmin();
  try {
    return await run();
  } catch (err) {
    if (err instanceof UploadError) return fail(err.message);
    console.error("[admin] action failed", err);
    return fail("Something went wrong while saving. Please try again.");
  }
}

// ---- auth ------------------------------------------------------------------------

export async function login(_prev: ActionState, form: FormData): Promise<ActionState> {
  if (!isAuthConfigured()) {
    return fail("Admin login isn't configured on this server yet. See ADMIN.md.");
  }
  const limitKey = `login:${await clientIp()}`;
  if (!rateLimit(limitKey, 5, 15 * 60_000).ok) {
    return fail("Too many sign-in attempts. Please wait 15 minutes and try again.");
  }

  const email = text(form, "email", 200).toLowerCase();
  const password = text(form, "password", 200);
  // Always verify the password (even for a wrong email) so response timing
  // doesn't reveal whether the email was correct.
  const passwordOk = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH!);
  const emailOk = email === process.env.ADMIN_EMAIL!.trim().toLowerCase();
  if (!passwordOk || !emailOk) return fail("Incorrect email or password.");

  clearRateLimit(limitKey);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

// ---- company info ------------------------------------------------------------

export async function saveCompany(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const legalName = text(form, "legalName");
    const email = text(form, "email", 200);
    if (!legalName) return fail("Company name is required.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Enter a valid email address.");

    await updateContent((c) => {
      c.company = {
        legalName,
        shortName: text(form, "shortName") || legalName,
        address: text(form, "address"),
        telephone: text(form, "telephone", 40),
        mobiles: lines(form, "mobiles", 6, 40),
        email,
        website: text(form, "website", 200),
        chairman: {
          name: text(form, "chairmanName"),
          title: text(form, "chairmanTitle"),
          quote: text(form, "chairmanQuote", 600),
          paragraphs: paragraphs(form, "chairmanMessage"),
        },
      };
    });
    refreshSite();
    return ok("Company information saved.");
  });
}

// ---- products ---------------------------------------------------------------------

export async function saveProduct(_prev: ActionState, form: FormData): Promise<ActionState> {
  return guarded(async () => {
    const slug = text(form, "slug", 40);
    const name = text(form, "name", 80);
    if (!name) return fail("Product name is required.");

    const properties = form.getAll("specProperty");
    const methods = form.getAll("specMethod");
    const units = form.getAll("specUnit");
    const values = form.getAll("specValue");
    const specs = properties
      .map((p, i) => {
        const method = String(methods[i] ?? "").trim().slice(0, 60);
        const unit = String(units[i] ?? "").trim().slice(0, 30);
        return {
          property: String(p).trim().slice(0, 80),
          value: String(values[i] ?? "").trim().slice(0, 200),
          ...(method ? { method } : {}),
          ...(unit ? { unit } : {}),
        };
      })
      .filter((s) => s.property && s.value)
      .slice(0, 30);

    const bodies = form.getAll("sectionBody");
    const itemLists = form.getAll("sectionItems");
    const sections = form
      .getAll("sectionTitle")
      .map((t, i) => {
        const body = String(bodies[i] ?? "").trim().slice(0, 4000);
        return {
          title: String(t).trim().slice(0, 120),
          ...(body ? { body } : {}),
          items: String(itemLists[i] ?? "")
            .split(/\r?\n/)
            .map((l) => l.trim().slice(0, 300))
            .filter(Boolean)
            .slice(0, 40),
        };
      })
      .filter((s) => s.title)
      .slice(0, 12);

    const newImage = file(form, "image");
    const uploaded = newImage ? await saveUpload(newImage) : null;

    const result = { found: false, previousImage: null as string | null };
    await updateContent((c) => {
      const product = c.products.find((p) => p.slug === slug);
      if (!product) return;
      result.found = true;
      result.previousImage = uploaded ? product.image : null;
      Object.assign(product, {
        name,
        tag: text(form, "tag", 40).toUpperCase(),
        short: text(form, "short", 200),
        description: text(form, "description", 1500),
        imageAlt: text(form, "imageAlt", 200) || name,
        applications: lines(form, "applications", 30, 80),
        specs,
        sections,
        ...(uploaded ? { image: uploaded } : {}),
      });
    });
    if (!result.found) {
      await deleteUpload(uploaded);
      return fail("That product no longer exists.");
    }
    await deleteUpload(result.previousImage);
    refreshSite();
    return ok(`${name} saved.`);
  });
}

// ---- enquiries --------------------------------------------------------------------

export async function updateEnquiryStatus(form: FormData) {
  await verifyAdmin();
  const status = text(form, "status", 20);
  if (!(ENQUIRY_STATUSES as readonly string[]).includes(status)) return;
  await setEnquiryStatus(text(form, "id", 60), status as EnquiryStatus);
  revalidatePath("/admin", "layout");
}

export async function removeEnquiry(form: FormData) {
  await verifyAdmin();
  await deleteEnquiry(text(form, "id", 60));
  revalidatePath("/admin", "layout");
}
