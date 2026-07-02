"use client";
import InputField from "@/components/custom-ui/InputField";
import { getMe, updateUser, updateMe, registerMacAddress } from "@/services/users/userService";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { UserType } from "@/types/user";
import { PencilIcon } from "@heroicons/react/24/solid";

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
      getMe().then((res) => {
        setUser(res);
        setLoading(false);
      }).catch(() => setLoading(false));
    }, []);
    
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
      await registerMacAddress();
      toast.success("MAC address berhasil diregistrasi!");
      const res = await getMe();
      setUser(res);
    } catch (error: unknown) {
      const msg = (error as any)?.response?.data?.message || "Gagal registrasi MAC address.";
      showErrorToast(msg, { duration: 5000 });
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showErrorToast("Password tidak boleh kosong!");
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorToast("Password tidak sama!");
      return;
    }

    if (newPassword.length < 6) {
      showErrorToast("Password minimal 6 karakter!");
      return;
    }

    try {
      await updateUser(user!._id, {
        name: user!.name,
        email: user!.email ?? "",
        password: newPassword,
      });

      toast.success("Password Berhasil Diupdate");
      setNewPassword("");
      setConfirmPassword("");

    } catch {
      showErrorToast("Gagal Edit Password.", { duration: 5000 });
    }
  };


  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      await updateMe(formData);
      toast.success("Foto profil berhasil diupdate!");
      const res = await getMe();
      setUser(res);
    } catch {
      showErrorToast("Gagal upload foto.", { duration: 5000 });
    }
    setUploadingPhoto(false);
    e.target.value = "";
  };

  const handleLogout = () => {
    window.location.href = '/logout';
  };
  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center">
            <div className="relative w-32.5 h-32.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(user?.image)}
                alt="profile"
                className="rounded-full object-cover w-full h-full"
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
              >
                <PencilIcon className="w-4 h-4 text-white" />
              </button>
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

          <p className="font-semibold text-lg md:text-xl">Update Password</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="New Password"
              type="password"
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <InputField
              label="Confirm New Password"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

          </div>
          <div className="flex w-full justify-end">
            <Button onClick={handleUpdatePassword} className="md:w-fit" size="full">Update</Button>
          </div>
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
            {/* {" "}or{" "}
            <a href="https://t.me/RaflyRayhansyah" className="text-primary font-semibold hover:underline">
              Vice President
            </a>. */}
          </p>
          {user?.role === 'user' && (
            <Button variant="destructive" onClick={handleLogout} className=" lg:hidden md:w-fit">
              Logout  
            </Button>
          )}
        </div>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default Profile;