export const DEFAULT_MAX_CROPPED_IMAGE_BYTES = 500 * 1024; // 500KB

export interface PixelCropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Crops `imageSrc` to `pixelCrop` on a canvas, then re-encodes as JPEG,
// stepping quality down until it fits under maxSizeBytes.
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCropArea,
  maxSizeBytes: number = DEFAULT_MAX_CROPPED_IMAGE_BYTES
): Promise<Blob> {
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

  const toBlob = (quality: number): Promise<Blob> =>
    new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), "image/jpeg", quality));

  let quality = 0.9;
  let blob = await toBlob(quality);
  while (blob.size > maxSizeBytes && quality > 0.1) {
    quality -= 0.1;
    blob = await toBlob(quality);
  }
  return blob;
}
