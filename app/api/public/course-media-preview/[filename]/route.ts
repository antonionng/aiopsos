import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import media from "@/lib/course-introductions/media.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ filename: string }> };
const allowedFiles = new Set(Object.values(media).flatMap(video =>
  [video.src, video.poster, video.captions, video.transcript].map(file => path.basename(file)),
));
const contentTypes: Record<string, string> = {
  ".mp4": "video/mp4", ".jpg": "image/jpeg", ".vtt": "text/vtt; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

async function serve(request: Request, context: Context, head: boolean) {
  // No review recordings or metadata are exposed by a production deployment.
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404 });
  if (!["127.0.0.1", "localhost", "[::1]"].includes(new URL(request.url).hostname)) {
    return new Response(null, { status: 404 });
  }
  const { filename } = await context.params;
  if (!allowedFiles.has(filename)) return new Response(null, { status: 404 });
  const file = path.join(process.cwd(), "output", "course-introductions", filename);
  let size: number;
  try { size = (await stat(file)).size; }
  catch { return new Response(null, { status: 404 }); }

  let start = 0;
  let end = size - 1;
  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    if (match[1]) {
      start = Number(match[1]);
      end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    } else {
      const count = Number(match[2]);
      if (count === 0) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
      start = Math.max(0, size - count);
    }
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
  }
  const headers: Record<string, string> = {
    "Content-Type": contentTypes[path.extname(filename)] || "application/octet-stream",
    "Content-Length": String(end - start + 1), "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
  };
  if (range) headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
  const body = head ? null : Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream<Uint8Array>;
  return new Response(body, { status: range ? 206 : 200, headers });
}

export function GET(request: Request, context: Context) { return serve(request, context, false); }
export function HEAD(request: Request, context: Context) { return serve(request, context, true); }
