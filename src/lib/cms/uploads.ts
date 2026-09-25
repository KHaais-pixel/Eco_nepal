import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { DATA_DIR } from "./store";

export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB
export const UPLOAD_URL_PREFIX = "/uploads/";

// Only raster formats, identified by their real file signature rather than
// the browser-supplied MIME type (which a client can set to anything).
// SVG is deliberately excluded: it can carry script.
const SIGNATURES: { ext: string; type: string; test: (b: Buffer) => boolean }[] = [
  { ext: "jpg", type: "image/jpeg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    ext: "png",
    type: "image/png",
    test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    ext: "webp",
    type: "image/webp",
    test: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP",
  },
];

export const CONTENT_TYPES: Record<string, string> = Object.fromEntries(
  SIGNATURES.map((s) => [s.ext, s.type])
);

// Stored names are always `<uuid>.<ext>` — checked on every read/delete so a
// crafted name can never escape the uploads folder.
export const SAFE_UPLOAD_NAME = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

export class UploadError extends Error {}

/** Validates and stores an uploaded image, returning its public URL. */
export async function saveUpload(file: File): Promise<string> {
  if (file.size === 0) throw new UploadError("The selected file is empty.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Images must be 8 MB or smaller.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const kind = SIGNATURES.find((s) => s.test(bytes));
  if (!kind) throw new UploadError("Only JPEG, PNG or WebP images are allowed.");

  const name = `${randomUUID()}.${kind.ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), bytes);
  return `${UPLOAD_URL_PREFIX}${name}`;
}

/** Deletes a previously uploaded image. Ignores built-in site images. */
export async function deleteUpload(url: string | null | undefined) {
  if (!url?.startsWith(UPLOAD_URL_PREFIX)) return;
  const name = url.slice(UPLOAD_URL_PREFIX.length);
  if (!SAFE_UPLOAD_NAME.test(name)) return;
  await unlink(path.join(UPLOAD_DIR, name)).catch(() => undefined);
}

export async function readUpload(name: string) {
  if (!SAFE_UPLOAD_NAME.test(name)) return null;
  try {
    const data = await readFile(path.join(UPLOAD_DIR, name));
    return { data, type: CONTENT_TYPES[name.split(".").pop()!] };
  } catch {
    return null;
  }
}
