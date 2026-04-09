"use client";
import InputField from "@/components/custom-ui/InputField";
import { getMe, updateUser } from "@/services/users/userService";
import { updateDeviceId } from "@/services/users/userService";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { UserType } from "@/types/user";

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState<UserType | null>(null); 
  const [loading, setLoading] = useState(true);
  const localDeviceId = typeof window !== 'undefined' ? localStorage.getItem('device_id') : null;

  useEffect(() => {
      getMe().then((res) => {
        setUser(res);
        setLoading(false);
      }).catch(() => setLoading(false));
    }, []);
    
    if (loading) return null;

  const maskDeviceId = (deviceId: string | null | undefined): string => {
    if (!deviceId) return "No Device ID";
    
    if (deviceId.length <= 6) return deviceId;
    
    const first3 = deviceId.slice(0, 3);
    const last3 = deviceId.slice(-3);
    
    const maskedLength = deviceId.length - 6;
    const masked = "x".repeat(maskedLength);
    
    return `${first3}${masked}${last3}`;
  };

  const handleUpdateDeviceId = async () => {
    try {
      await updateDeviceId({ device_id: localDeviceId });
      toast.success("Device ID berhasil dihapus. Redirecting...");
      localStorage.removeItem('token');
      if (setUser) {
        setUser(null);
      }
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch {
      showErrorToast("Gagal update Device ID.", { duration: 5000 });
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

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center">
            <Image
              src="/icon/profile.png"
              alt="profile"
              width={130}
              height={130}
              className="rounded-full"
            />
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
                  value={maskDeviceId(user?.device_id)}
                  readOnly
                />
              </div>
                <Button
                  className="md:w-fit"
                  disabled={!Boolean(user?.change_device_id)}
                  onClick={handleUpdateDeviceId}
                  size="full"
                >
                  Reset
                </Button>
          </div>
          <p className="text-sm text-gray-600">
            To change the Device ID permission, contact the{" "}
            <a href="https://t.me/zulfifazhar" className="text-primary font-semibold hover:underline">
              President
            </a>
            {" "}or{" "}
            <a href="https://t.me/RaflyRayhansyah" className="text-primary font-semibold hover:underline">
              Vice President
            </a>.
          </p>
        </div>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default Profile;