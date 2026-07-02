import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(img?: string | null): string {
  if (!img) return "/logo/LogoAplication.png";
  if (img.startsWith("/uploads/")) return `${process.env.NEXT_PUBLIC_API_URL}${img}`;
  return img;
}
