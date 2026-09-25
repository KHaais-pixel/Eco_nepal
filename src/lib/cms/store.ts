import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_CONTENT } from "./defaults";
import type { Enquiry, EnquiryStatus, SiteContent } from "./types";

// All runtime data lives outside `public/` and outside the build output, so
// it survives redeploys. On the VPS, point DATA_DIR at a persistent folder
// (e.g. /var/lib/econepal) and back it up.
export const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json");

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

// Write to a temp file then rename: a crash mid-write can never leave a
// half-written (corrupt) JSON file behind.
async function writeJsonAtomic(file: string, data: unknown) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await rename(tmp, file);
}

// Serialises every read-modify-write in this process so two admin saves (or
// two simultaneous enquiries) can't overwrite each other's changes.
let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

function withDefaults(saved: Partial<SiteContent> | null): SiteContent {
  if (!saved) return structuredClone(DEFAULT_CONTENT);
  return {
    company: {
      ...DEFAULT_CONTENT.company,
      ...saved.company,
      chairman: { ...DEFAULT_CONTENT.company.chairman, ...saved.company?.chairman },
    },
    products: DEFAULT_CONTENT.products.map(
      (def) => ({ ...def, ...saved.products?.find((p) => p.slug === def.slug) })
    ),
  };
}

export async function getContent(): Promise<SiteContent> {
  return withDefaults(await readJson<Partial<SiteContent>>(CONTENT_FILE));
}

export function updateContent(mutate: (content: SiteContent) => void | Promise<void>) {
  return withLock(async () => {
    const content = await getContent();
    await mutate(content);
    await writeJsonAtomic(CONTENT_FILE, content);
    return content;
  });
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const list = (await readJson<Enquiry[]>(ENQUIRIES_FILE)) ?? [];
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addEnquiry(data: Omit<Enquiry, "id" | "createdAt" | "status">) {
  return withLock(async () => {
    const list = (await readJson<Enquiry[]>(ENQUIRIES_FILE)) ?? [];
    list.push({ ...data, id: randomUUID(), createdAt: new Date().toISOString(), status: "new" });
    await writeJsonAtomic(ENQUIRIES_FILE, list);
  });
}

export function setEnquiryStatus(id: string, status: EnquiryStatus) {
  return withLock(async () => {
    const list = (await readJson<Enquiry[]>(ENQUIRIES_FILE)) ?? [];
    const item = list.find((e) => e.id === id);
    if (!item) return;
    item.status = status;
    await writeJsonAtomic(ENQUIRIES_FILE, list);
  });
}

export function deleteEnquiry(id: string) {
  return withLock(async () => {
    const list = (await readJson<Enquiry[]>(ENQUIRIES_FILE)) ?? [];
    await writeJsonAtomic(
      ENQUIRIES_FILE,
      list.filter((e) => e.id !== id)
    );
  });
}
