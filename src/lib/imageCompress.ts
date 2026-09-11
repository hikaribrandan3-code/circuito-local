/**
 * Client-side image compression via canvas, run before every upload to
 * Supabase storage. This guarantees small file sizes regardless of whether
 * Supabase's on-the-fly image transforms are available on the project's
 * plan — phone camera photos (often 3–8 MB) get downsized before they ever
 * leave the browser.
 */

const MAX_DIMENSION = 1600;
const QUALITY = 0.82;
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("Elegí un archivo de imagen válido");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("La imagen no puede superar 15 MB");

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No pudimos preparar la imagen");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );
  if (!blob) throw new Error("No pudimos comprimir la imagen");
  if (blob.size > MAX_UPLOAD_BYTES) throw new Error("La imagen comprimida supera 15 MB");

  const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], newName, { type: "image/webp" });
}
