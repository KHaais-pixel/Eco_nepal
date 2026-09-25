import { readUpload } from "@/lib/cms/uploads";

// Serves admin-uploaded images from DATA_DIR/uploads. (Files added to
// `public/` after a build aren't served by `next start`, so uploads can't
// simply live there.) Names are unique per upload, so they can be cached
// forever — replacing an image always produces a new URL.
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const upload = await readUpload(file);
  if (!upload) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(upload.data), {
    headers: {
      "Content-Type": upload.type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
