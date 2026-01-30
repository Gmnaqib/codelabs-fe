"use client";
import InputField from "@/components/custom-ui/InputField";
import { updateUser } from "@/services/users/userService";
import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user } = useAuth();

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

    } catch (err) {
      console.log(err);
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
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
