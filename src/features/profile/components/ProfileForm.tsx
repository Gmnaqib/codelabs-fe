"use client"

import React, { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/custom-ui/InputField";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "@heroicons/react/24/solid";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { profileSchema, type ProfileForm as ProfileFormValues } from "@/features/profile/config/schemas";
import { handleError } from "@/shared/services";

const MAX_SIZE_BYTES = 500 * 1024; // 500KB

const getCroppedImg = async (imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }): Promise<Blob> => {
  const image = new Image();
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
  while (blob.size > MAX_SIZE_BYTES && quality > 0.1) {
    quality -= 0.1;
    blob = await toBlob(quality);
  }
  return blob;
};

export default function ProfileForm() {
  const { user, loading, uploadPhoto, updatePassword, resetMacAddress } = useProfile();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoTooltip, setShowPhotoTooltip] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Crop state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onCropComplete = useCallback((_: unknown, pixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const canUpdatePhoto = (): boolean => {
    if (user?.role === "admin") return true;
    if (!user?.image_updated_at) return true;
    return Date.now() - new Date(user.image_updated_at).getTime() >= 7 * 24 * 60 * 60 * 1000;
  };

  const getRemainingPhotoTime = (): string => {
    if (!user?.image_updated_at) return "";
    const remaining = 7 * 24 * 60 * 60 * 1000 - (Date.now() - new Date(user.image_updated_at).getTime());
    if (remaining <= 0) return "";
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${days} hari ${hours} jam ${minutes} menit`;
  };

  if (loading) return null;

  const resolveImageUrl = (img?: string | null) => {
    if (!img) return "/logo/LogoAplication.png";
    if (img.startsWith("/uploads/")) return `${process.env.NEXT_PUBLIC_API_URL}${img}`;
    return img;
  };

  const maskMac = (mac: string | null | undefined): string => {
    if (!mac) return "No Device ID";
    return mac[0] + "X".repeat(mac.length - 2) + mac[mac.length - 1];
  };

  const handleRegisterMac = async () => {
    try {
      await resetMacAddress();
      toast.success("MAC address berhasil diregistrasi!");
    } catch (err) {
      const appError = handleError(err);
      showErrorToast(appError.message || "Gagal registrasi MAC address.", { duration: 5000 });
    }
  };

  const onSubmitPassword = async (values: ProfileFormValues) => {
    try {
      await updatePassword(values.newPassword);
      toast.success("Password Berhasil Diupdate");
      reset({ newPassword: "", confirmPassword: "" });
    } catch {
      showErrorToast("Gagal Edit Password.", { duration: 5000 });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedAreaPixels) return;
    setShowCropDialog(false);
    setUploadingPhoto(true);
    try {
      const croppedBlob = await getCroppedImg(cropSrc, croppedAreaPixels);
      if (croppedBlob.size > MAX_SIZE_BYTES) {
        showErrorToast("Ukuran foto terlalu besar. Maksimal 500KB.", { duration: 5000 });
        setUploadingPhoto(false);
        return;
      }
      const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("image", file);
      await uploadPhoto(formData);
      toast.success("Foto profil berhasil diupdate!");
      window.dispatchEvent(new CustomEvent("user-photo-updated"));
    } catch (err) {
      const appError = handleError(err);
      showErrorToast(appError.message || "Gagal upload foto.", { duration: 5000 });
    }
    setUploadingPhoto(false);
    setCropSrc(null);
  };

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center">
        <div className="relative w-32.5 h-32.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImageUrl(user?.image)}
            alt="profile"
            className="rounded-full object-cover w-full h-full"
          />
          <div className="relative">
            <button
              onClick={() => canUpdatePhoto() && !uploadingPhoto && photoInputRef.current?.click()}
              disabled={uploadingPhoto}
              onMouseEnter={() => !canUpdatePhoto() && setShowPhotoTooltip(true)}
              onMouseLeave={() => setShowPhotoTooltip(false)}
              className={`absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                canUpdatePhoto()
                  ? "bg-primary hover:bg-primary/90 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <PencilIcon className="w-4 h-4 text-white" />
            </button>
            {showPhotoTooltip && !canUpdatePhoto() && (
              <div className="absolute bottom-10 right-0 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 w-52 z-10 shadow-lg">
                <p className="font-semibold mb-0.5">Foto belum bisa diubah</p>
                <p className="text-gray-300">Sisa waktu: {getRemainingPhotoTime()}</p>
              </div>
            )}
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        <p className="text-lg mt-2">{user?.name}</p>
        <p className="capitalize font-semibold text-xl md:text-2xl">{user?.role}</p>
      </div>

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={(open) => { if (!open) { setShowCropDialog(false); setCropSrc(null); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Crop Foto Profil</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-72 bg-black rounded-lg overflow-hidden">
            {cropSrc && (
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-xs text-muted-foreground text-center">Geser dan zoom untuk menyesuaikan</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCropDialog(false); setCropSrc(null); }}>
              Batal
            </Button>
            <Button onClick={handleCropConfirm}>
              Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="font-semibold text-lg md:text-xl">Update Password</p>
      <form onSubmit={handleSubmit(onSubmitPassword)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <InputField
                  label="New Password"
                  type="password"
                  placeholder="********"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            {errors.newPassword && <span className="text-xs text-red-500">{errors.newPassword.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <InputField
                  label="Confirm New Password"
                  type="password"
                  placeholder="********"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button type="submit" disabled={isSubmitting} className="md:w-fit" size="full">Update</Button>
        </div>
      </form>
      <p className="font-semibold text-lg md:text-xl">Update Device Id</p>
      <div className="grid grid-cols-1 md:w-1/2 md:grid-cols-none md:flex items-end gap-4">
        <div className="w-full">
          <InputField
            label="Device Id"
            type="text"
            placeholder="No Device ID"
            value={maskMac(user?.mac_address)}
            readOnly
          />
        </div>
        <Button
          className="md:w-fit"
          disabled={!user?.change_mac_address}
          onClick={handleRegisterMac}
          size="full"
        >
          Reset
        </Button>
      </div>
      <p className="text-sm text-gray-600">
        To change the Device ID permission, contact the{" "}
        <a href="https://t.me/favianjiwani" className="text-primary font-semibold hover:underline">
          President
        </a>
      </p>
      {user?.role === 'user' && (
        <Button variant="destructive" onClick={handleLogout} className="lg:hidden md:w-fit">
          Logout
        </Button>
      )}
    </div>
  );
}
