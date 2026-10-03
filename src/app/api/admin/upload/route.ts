import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function slugify(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Chybí soubor." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Povolené formáty: JPG, PNG, WebP, GIF — uloží se jako WebP." },
        { status: 400 },
      );
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Soubor musí mít maximálně 8 MB." },
        { status: 400 },
      );
    }

    const folderRaw = String(form.get("folder") || "menu");
    const folder =
      folderRaw === "hero" || folderRaw === "gallery" || folderRaw === "menu"
        ? folderRaw
        : "menu";

    const base =
      slugify(path.parse(file.name).name) ||
      `${folder}-${randomBytes(4).toString("hex")}`;
    const filename = `${base}-${Date.now().toString(36)}.webp`;
    const dir = path.join(process.cwd(), "public", "images", folder);
    await fs.mkdir(dir, { recursive: true });

    const input = Buffer.from(await file.arrayBuffer());
    const webp = await sharp(input)
      .rotate()
      .webp({ quality: 85, effort: 4, alphaQuality: 90 })
      .toBuffer();

    await fs.writeFile(path.join(dir, filename), webp);

    return NextResponse.json({
      ok: true,
      path: `/images/${folder}/${filename}`,
      converted: file.type !== "image/webp",
      bytes: webp.byteLength,
    });
  } catch {
    return NextResponse.json(
      { error: "Nahrání nebo převod do WebP selhal." },
      { status: 500 },
    );
  }
}
