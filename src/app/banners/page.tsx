"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InputField from "@/components/custom-ui/InputField";
import DialogField from "@/components/custom-ui/DialogField";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmptyState from "@/components/custom-ui/EmptyState";
import BannerImagePicker from "@/features/banners/components/BannerImagePicker";
import { toast } from "sonner";
import { useAuthStore } from "@/shared/state";
import { resolveImageUrl } from "@/lib/utils";
import { handleError } from "@/shared/services";
import {
  getAllBanners,
  getMyBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  buyBanner,
  equipBanner,
  unequipBanner,
  type RawBanner,
  type MyBanners,
} from "@/services/banner/bannerService";
import { getMyWallet, type PointWallet } from "@/services/wallet/walletService";

export default function BannersPage() {
  const isAdmin = useAuthStore((s) => s.hasRole(["admin"]));

  const [banners, setBanners] = useState<RawBanner[]>([]);
  const [mine, setMine] = useState<MyBanners | null>(null);
  const [wallet, setWallet] = useState<PointWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [pointCost, setPointCost] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [editingBanner, setEditingBanner] = useState<RawBanner | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPointCost, setEditPointCost] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deletingBanner, setDeletingBanner] = useState<RawBanner | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [b, m, w] = await Promise.all([getAllBanners(), getMyBanners(), getMyWallet()]);
      setBanners(b);
      setMine(m);
      setWallet(w);
    } catch (err) {
      toast.error(handleError(err).message || "Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetAddForm = () => {
    setName("");
    setPointCost("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAdd = async () => {
    if (!name.trim() || !pointCost || !imageFile) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("point_cost", pointCost);
      formData.append("image", imageFile);
      await createBanner(formData);
      toast.success("Banner created successfully!");
      setIsAddOpen(false);
      resetAddForm();
      fetchAll();
    } catch (err) {
      toast.error(handleError(err).message || "Failed to create banner.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (banner: RawBanner) => {
    setEditingBanner(banner);
    setEditName(banner.name);
    setEditPointCost(String(banner.point_cost));
    setEditImageFile(null);
    setEditImagePreview(resolveImageUrl(banner.image));
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingBanner || !editName.trim() || !editPointCost) return;
    setEditSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", editName.trim());
      formData.append("point_cost", editPointCost);
      if (editImageFile) formData.append("image", editImageFile);
      await updateBanner(editingBanner._id, formData);
      toast.success("Banner updated successfully!");
      setIsEditOpen(false);
      setEditingBanner(null);
      fetchAll();
    } catch (err) {
      toast.error(handleError(err).message || "Failed to update banner.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteClick = (banner: RawBanner) => {
    setDeletingBanner(banner);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingBanner) return;
    setActioningId(deletingBanner._id);
    try {
      await deleteBanner(deletingBanner._id);
      toast.success("Banner deleted!");
      setIsDeleteOpen(false);
      setDeletingBanner(null);
      fetchAll();
    } catch (err) {
      toast.error(handleError(err).message || "Failed to delete banner.");
    } finally {
      setActioningId(null);
    }
  };

  const ownedIds = new Set((mine?.owned ?? []).map((o) => o._id));

  const handleBuy = async (id: string) => {
    setActioningId(id);
    try {
      await buyBanner(id);
      toast.success("Banner purchased!");
      fetchAll();
    } catch (err) {
      toast.error(handleError(err).message || "Failed to buy banner.");
    } finally {
      setActioningId(null);
    }
  };

  const handleEquip = async (id: string) => {
    setActioningId(id);
    try {
      await equipBanner(id);
      toast.success("Banner equipped!");
      fetchAll();
    } catch (err) {
      toast.error(handleError(err).message || "Failed to equip banner.");
    } finally {
      setActioningId(null);
    }
  };

  const handleUnequip = async () => {
    setActioningId("unequip");
    try {
      await unequipBanner();
      toast.success("Banner unequipped!");
      fetchAll();
    } catch (err) {
      toast.error(handleError(err).message || "Failed to unequip banner.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-semibold">Shop</p>
            {wallet && (
              <p className="text-sm text-muted-foreground">
                Your balance: <span className="font-semibold text-primary">{wallet.balance}</span> points
              </p>
            )}
          </div>

          {isAdmin && (
            <DialogField
              name="Add Item"
              title="Add Item"
              open={isAddOpen}
              onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetAddForm(); }}
              onSubmit={handleAdd}
              submitDisabled={!name.trim() || !pointCost || !imageFile || submitting}
            >
              <div className="flex flex-col gap-3 min-w-64">
                <InputField
                  type="text"
                  placeholder="Ex: Gold Banner"
                  label="Name"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
                <InputField
                  type="number"
                  placeholder="Ex: 50"
                  label="Price (points)"
                  value={pointCost}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPointCost(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Image</label>
                  <BannerImagePicker
                    previewUrl={imagePreview}
                    onChange={(file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }}
                  />
                </div>
              </div>
            </DialogField>
          )}
        </div>

        <Card className="p-5">
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && banners.length === 0 && <EmptyState message="No banners available yet." className="py-8" />}
          {!loading && banners.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => {
                const owned = ownedIds.has(banner._id);
                const active = mine?.activeBannerId === banner._id;
                const isActioning = actioningId === banner._id;
                return (
                  <div key={banner._id} className="overflow-hidden rounded-xl border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resolveImageUrl(banner.image)} alt={banner.name} className="h-32 w-full object-cover" />
                    <div className="flex flex-col gap-2 p-4">
                      <p className="font-medium">{banner.name}</p>
                      <p className="text-sm text-muted-foreground">{banner.point_cost} points</p>
                      {active ? (
                        <Button
                          size="sm"
                          className="text-sm"
                          disabled={actioningId === "unequip"}
                          onClick={handleUnequip}
                        >
                          Unequip
                        </Button>
                      ) : owned ? (
                        <Button variant="outline" size="sm" disabled={isActioning} onClick={() => handleEquip(banner._id)}>
                          Equip
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled={isActioning || (wallet ? wallet.balance < banner.point_cost : false)}
                          onClick={() => handleBuy(banner._id)}
                        >
                          Buy
                        </Button>
                      )}
                      {isAdmin && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClick(banner)}>
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                            disabled={isActioning}
                            onClick={() => handleDeleteClick(banner)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {isAdmin && (
          <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setEditingBanner(null); }}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Edit {editingBanner?.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <InputField
                  type="text"
                  placeholder="Ex: Gold Banner"
                  label="Name"
                  value={editName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                />
                <InputField
                  type="number"
                  placeholder="Ex: 50"
                  label="Price (points)"
                  value={editPointCost}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditPointCost(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Image</label>
                  <BannerImagePicker
                    previewUrl={editImagePreview}
                    placeholderText="Click or drag to replace"
                    onChange={(file) => { setEditImageFile(file); setEditImagePreview(URL.createObjectURL(file)); }}
                  />
                </div>
                <div className="mt-2 flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                  <Button onClick={handleEditSubmit} disabled={!editName.trim() || !editPointCost || editSubmitting}>Submit</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {isAdmin && (
          <Dialog open={isDeleteOpen} onOpenChange={(open) => { setIsDeleteOpen(open); if (!open) setDeletingBanner(null); }}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Delete {deletingBanner?.name}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Anyone who owns or has this banner equipped will lose it. This can&apos;t be undone.
              </p>
              <div className="mt-2 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={actioningId === deletingBanner?._id}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </MotionWrapper>
    </ProtectedRoute>
  );
}
