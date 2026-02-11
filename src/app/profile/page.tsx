"use client";
import InputField from "@/components/custom-ui/InputField";
import { updateUser } from "@/services/users/userService";
import { updateDeviceId } from "@/services/users/userService";
import { getUserById } from "@/services/users/userService";
import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { Button } from "@/components/ui/button";

const Profile = () => {
    const handleUpdateDeviceId = async () => {
      try {
        await updateDeviceId({ device_id: "67hhgduisuhgfiuwuisd2" });
        if (user?.id) {
          const updated = await getUserById(user.id);
          setUserDetail(updated);
        }
        toast.success("Device ID berhasil diupdate");
      } catch {
        showErrorToast("Gagal update Device ID.", { duration: 5000 });
      }
    };
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user } = useAuth();
  const [userDetail, setUserDetail] = useState<any>(null);

  React.useEffect(() => {
    if (user?.id) {
      getUserById(user.id).then(setUserDetail);
    }
  }, [user]);

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return alert("Password tidak boleh kosong!");
    }

    if (newPassword !== confirmPassword) {
      return alert("Password tidak sama!");
    }

    try {
      await updateUser(user!.id, {
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
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center">
          <Image
            src="/icon/profile.png"
            alt="profile"
            width={130}
            height={130}
            className="rounded-full"
          />
          <p className="text-sm mt-2">{user?.name}</p>
          <p className="capitalize font-bold text-2xl">{user?.role}</p>
        </div>

        <p className="font-bold text-xl">Update Password</p>
        <div className="grid grid-cols-2 gap-4">
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
          <Button onClick={handleUpdatePassword} className="w-fit">Update</Button>
        </div>
        <p className="font-bold text-xl">Update Device Id</p>
        <div className="flex w-1/2 items-end gap-4">
            <div className="w-full">
              <InputField
                label="Device Id"
                type="text"
                placeholder="XXXXXXXXXXXXXX"
                value={userDetail?.device_id || user?.device_id || "XXXXXXXXXXXXXX"}
                readOnly
              />
            </div>
            <Button
              className="w-fit"
              disabled={userDetail?.change_device_id === false}
              onClick={handleUpdateDeviceId}
            >
              Update
            </Button>
        </div>
        <p>To change the Device ID, you can contact the <a href="https://t.me/zulfifazhar" className="text-primary font-semibold">President</a> or <a href="https://t.me/RaflyRayhansyah" className="text-primary font-semibold">Vice President</a>.</p>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
