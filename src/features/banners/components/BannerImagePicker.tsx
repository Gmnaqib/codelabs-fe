"use client"

import React, { useCallback, useId, useState } from "react";
import Cropper from "react-easy-crop";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCroppedImg, type PixelCropArea } from "@/shared/utils";

// Matches the banner's wide-format display (dashboard row background, shop
// card thumbnail) — cropping to this ratio up front keeps every stored
// banner image consistent, instead of leaving it to whatever the admin's
// original upload happened to be shaped like.
const BANNER_ASPECT = 3;

interface BannerImagePickerProps {
  previewUrl: string | null;
  onChange: (file: File) => void;
  placeholderText?: string;
}

export default function BannerImagePicker({ previewUrl, onChange, placeholderText = "Click or drag to upload" }: BannerImagePickerProps) {
  const inputId = useId();

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCropArea | null>(null);

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    loadFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    loadFile(file);
  };

  // Re-opens the cropper on whatever is already shown (a fresh pick or the
  // existing saved image) instead of requiring a brand new file.
  const handleAdjustCrop = () => {
    if (!previewUrl) return;
    setCropSrc(previewUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setShowCropDialog(true);
  };

  const onCropComplete = useCallback((_: unknown, pixels: PixelCropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedAreaPixels) return;
    const blob = await getCroppedImg(cropSrc, croppedAreaPixels);
    onChange(new File([blob], "banner.jpg", { type: "image/jpeg" }));
    setShowCropDialog(false);
    setCropSrc(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-primary/40 bg-secondary/30 text-center transition-colors hover:bg-secondary/50"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="preview" className="h-28 w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-8">
            <CloudArrowUpIcon className="size-10 text-primary" />
            <p className="text-sm font-medium">{placeholderText}</p>
            <p className="text-xs text-muted-foreground">PNG or JPG</p>
          </div>
        )}
        <input id={inputId} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      {previewUrl && (
        <Button type="button" variant="outline" size="sm" onClick={handleAdjustCrop}>
          Adjust Crop
        </Button>
      )}

      <Dialog open={showCropDialog} onOpenChange={(open) => { if (!open) { setShowCropDialog(false); setCropSrc(null); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop Banner Image</DialogTitle>
          </DialogHeader>
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-black">
            {cropSrc && (
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={BANNER_ASPECT}
                mediaProps={{ crossOrigin: "anonymous" }}
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
          <p className="text-center text-xs text-muted-foreground">Drag and zoom to adjust</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCropDialog(false); setCropSrc(null); }}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
