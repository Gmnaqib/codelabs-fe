"use client";

import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InputField from "@/components/custom-ui/InputField";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/users/userService";
import { getAttendanceToday, postCheckinByAdmin } from "@/services/attendance/attendanceService";
import { toast } from "sonner";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type UserItem = {
  _id: string;
  name: string;
  nim: string;
  role: string;
};

const CheckInPage = () => {
  const [search, setSearch] = useState("");
  const [usersWithoutAttendance, setUsersWithoutAttendance] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allUsers, todayRecords] = await Promise.all([
        getAllUsers(),
        getAttendanceToday(),
      ]);

      const attendedIds = new Set<string>(
        (todayRecords || []).map((a: any) => String(a.userId))
      );

      const without: UserItem[] = allUsers
        .filter((u: any) => !attendedIds.has(String(u._id)))
        .map((u: any) => ({
          _id: String(u._id),
          name: u.name || "",
          nim: u.nim || "",
          role: u.role || "",
        }));

      setUsersWithoutAttendance(without);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckin = async (userId: string) => {
    setCheckingIn(userId);
    try {
      await postCheckinByAdmin(userId);
      toast.success("Berhasil check in!");
      await fetchData();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Gagal check in user";
      toast.error(msg);
    }
    setCheckingIn(null);
  };

  const filtered = usersWithoutAttendance.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.nim.includes(search)
  );

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Check In</h1>
              <p className="text-sm text-muted-foreground">{today}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <UserGroupIcon className="w-4 h-4" />
                <span>{usersWithoutAttendance.length} belum hadir</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchData}
                disabled={loading}
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <InputField
            type="text"
            placeholder="Cari nama atau NIM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Card className="p-5">
            {loading ? (
              <p className="text-center py-8 text-sm text-muted-foreground">
                Loading...
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground">
                {search
                  ? "Tidak ada anggota yang cocok."
                  : "Semua anggota sudah hadir hari ini!"}
              </p>
            ) : (
              <div className="flex flex-col">
                {filtered.map((user, i) => (
                  <div
                    key={user._id}
                    className={`flex items-center justify-between py-3 ${
                      i < filtered.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.nim} · {user.role}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCheckin(user._id)}
                      disabled={checkingIn === user._id}
                    >
                      {checkingIn === user._id ? "..." : "Check In"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default CheckInPage;
