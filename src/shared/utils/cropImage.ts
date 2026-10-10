export const DEFAULT_MAX_CROPPED_IMAGE_BYTES = 500 * 1024; // 500KB

export interface PixelCropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GetCroppedImgOptions {
  maxSizeBytes?: number;
  // JPEG has no alpha channel — any transparency in the source gets
  // silently flattened to an opaque fill. "image/png" always preserves it;
  // "auto" (the default) only pays PNG's larger file size when the crop
  // actually contains transparent pixels, so an ordinary photo still gets
  // JPEG's much smaller size.
  format?: "image/jpeg" | "image/png" | "auto";
}

const hasTransparency = (ctx: CanvasRenderingContext2D, width: number, height: number): boolean => {
  const { data } = ctx.getImageData(0, 0, width, height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
};

// Crops `imageSrc` to `pixelCrop` on a canvas, then re-encodes it. For JPEG,
// steps quality down until it fits under maxSizeBytes — PNG is lossless so
// quality/size-stepping doesn't apply and the first encode is returned as-is.
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCropArea,
  options: GetCroppedImgOptions = {}
): Promise<Blob> {
  const { maxSizeBytes = DEFAULT_MAX_CROPPED_IMAGE_BYTES, format: requestedFormat = "auto" } = options;

  const image = new Image();
  // Needed to re-crop an already-uploaded image: it's loaded from the API's
  // origin (not a local blob: URL), and without this the canvas below would
  // be tainted and canvas.toBlob() would silently fail.
  image.crossOrigin = "anonymous";
  image.src = imageSrc;
  await new Promise<void>((resolve) => { image.onload = () => resolve(); });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

  const format: "image/jpeg" | "image/png" =
    requestedFormat === "auto" ? (hasTransparency(ctx, canvas.width, canvas.height) ? "image/png" : "image/jpeg") : requestedFormat;

  const toBlob = (quality: number): Promise<Blob> =>
    new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), format, quality));

  let quality = 0.9;
  let blob = await toBlob(quality);
  if (format === "image/png") return blob;

  while (blob.size > maxSizeBytes && quality > 0.1) {
    quality -= 0.1;
    blob = await toBlob(quality);
  }
  return blob;
}
