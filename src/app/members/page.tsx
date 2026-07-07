"use client";

import { useEffect, useState } from "react";
import DialogField from "@/components/custom-ui/DialogField";
import { DropdownField } from "@/components/custom-ui/DropdownField";
import InputField from "@/components/custom-ui/InputField";
import { TableField } from "@/components/custom-ui/TableField";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { getAllUsers, createUser, multipleRegisterUsers } from "@/services/users/userService";
import { UserApiResponse, UserType } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { useTableStore } from "@/shared/state";

const Members = () => {
  const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All Role");
  const [filterSubriset, setFilterSubriset] = useState("All SubRiset");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [mode, setMode] = useState<'Register' | 'Multiple Register'>('Register');
  const [multipleEmails, setMultipleEmails] = useState("");

  const [form, setForm] = useState({
    nim: "",
    name: "",
    email: "",
    majors: "",
    years: "",
    role: "",
    password: "password",
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fetchData = async () => {
    try {
      const data = await getAllUsers();

      const mapped: UserType[] = (data as UserApiResponse[]).map((u) => ({
        _id: u._id || "",
        nim: u.nim || "",
        name: u.name || "",
        email: u.email || "",
        role: u.role ? u.role : "Other",
        status: u.status || "Unknown",
        subriset: ["ui/ux", "mobile", "iot", "website", "game", "data"].includes(u.research?.toLowerCase() || "")
          ? u.research || "Other"
          : "Other",
        change_mac_address: u.change_mac_address,
        product_id: u.product_id,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users
    .filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) =>
      filterRole === "All Role" ? true : u.role === filterRole
    )
    .filter((u) =>
      filterSubriset === "All SubRiset" ? true : u.subriset === filterSubriset
    )
    .filter((u) =>
      filterStatus === "All Status" ? true : u.status === filterStatus
    );

  const handleCreateMember = async () => {
    try {
      const emailPrefix = form.email.replace(/@mahasiswa\.unikom\.ac\.id$/, "");
      const payload = {
        name: form.name,
        email: emailPrefix + "@mahasiswa.unikom.ac.id",
        password: "password",
        nim: form.nim,
        majors: form.majors || "Unknown",
        years: form.years || "Unknown",
        role: form.role || "User",
      };

      await createUser(payload);

      await fetchData();
      toast.success("User created successfully!");

      setForm({
        nim: "",
        name: "",
        email: "",
        majors: "",
        years: "",
        role: "",
        password: "password",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create member");
    }
  };

  const handleMultipleRegister = async () => {
    try {
      const emails = multipleEmails
        .split(/\r?\n|,|;/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
        .map((e) => e.endsWith("@mahasiswa.unikom.ac.id") ? e : e + "@mahasiswa.unikom.ac.id");
      if (emails.length === 0) {
        toast.error("Please enter at least one email.");
        return;
      }
      await multipleRegisterUsers({ emails });
      await fetchData();
      toast.success("Multiple users registered successfully!");
      setMultipleEmails("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to register multiple members");
    }
  };

  const handleSubmitMember = async (closeDialog?: () => void) => {
    if (mode === 'Register') {
      await handleCreateMember();
    } else {
      await handleMultipleRegister();
    }
    closeDialog?.();
  };

  const isNimEmailMismatch = (() => {
    const match = form.email.match(/\.([0-9]+)$/);
    return form.nim && match && match[1] !== form.nim;
  })();

  return (
    <ProtectedRoute roles={['admin', 'president', 'vice president']}>
      <MotionWrapper>
        <div className="w-full flex flex-col">

          <div className="flex w-full justify-between mb-4 gap-4">
            <div className="flex gap-4">
              <InputField
                type="text"
                placeholder="Search by Name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setGlobalSearchQuery(e.target.value);
                }}
              />

              <DropdownField
                title={filterRole}
                menu={["All Role", "admin", "lecturer", "president", "vice president", "minister of research", "minister of competition", "minister of branding", "minister of operation", "user"]}
                onSelect={(v) => {
                  setFilterRole(v);
                  console.log('Filter Role selected:', v);
                }}
              />

              <DropdownField
                title={filterSubriset}
                menu={[
                  "All SubRiset",
                  "ui/ux",
                  "mobile",
                  "iot",
                  "website",
                  "game",
                  "data",
                  "other",
                ]}
                onSelect={(v) => {
                  setFilterSubriset(v);
                  console.log('Filter Subriset selected:', v);
                }}
              />

              <DropdownField
                title={filterStatus}
                menu={["All Status", "active", "inactive", "graduated"]}
                onSelect={(v) => {
                  setFilterStatus(v);
                  console.log('Filter Status selected:', v);
                }}
              />
            </div>

            <DialogField
              name="Create New Member"
              title="Create New Member"
              onSubmit={(closeDialog?: () => void) => {
                handleSubmitMember().then(() => {
                  if (closeDialog) closeDialog();
                });
              }}
              submitDisabled={
                mode === 'Register'
                  ? !form.name || !form.email || !form.nim || !form.majors || !form.years || !!isNimEmailMismatch
                  : multipleEmails.trim() === ""
              }
            >
              <div className="flex justify-center">
                <Button
                  variant="link"
                  className="w-80 flex items-center rounded-full relative select-none border border-gray-300 bg-gray-200 transition-colors duration-300"
                  onClick={() => setMode(mode === 'Register' ? 'Multiple Register' : 'Register')}
                >
                  <span
                    className="absolute center left-1 h-10 w-40 rounded-full transition-transform duration-300 bg-primary"
                    style={{ transform: mode === 'Register' ? 'translateX(0)' : 'translateX(150px)' }}
                  />
                  <span className="w-full flex justify-between items-center relative z-10">
                    <span className={`w-40 text-center text-base font-semibold leading-6 transition-colors duration-300 -ml-5 ${mode === 'Register' ? 'text-white' : 'text-gray-600'}`}>Register</span>
                    <span className={`w-40 text-center text-base font-semibold leading-6 transition-colors duration-300 -mr-5 ${mode === 'Multiple Register' ? 'text-white' : 'text-gray-600'}`}>Multiple Register</span>
                  </span>
                </Button>
              </div>

              {mode === 'Register' ? (
                <div className="flex flex-col gap-3 ">
                  <InputField
                    placeholder="1023456"
                    label="NIM"
                    type="number"
                    value={form.nim}
                    onChange={(e) => updateForm("nim", e.target.value)}
                  />

                  <InputField
                    placeholder="Jhon Doe"
                    label="Name"
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                  />

                  <div className="relative">
                    <InputField
                      placeholder="ramdani.1052302"
                      label="Email"
                      type="text"
                      value={form.email.replace(/@mahasiswa\.unikom\.ac\.id$/, "")}
                      onChange={(e) => updateForm("email", e.target.value.replace(/@mahasiswa\.unikom\.ac\.id$/, ""))}
                    />
                    <span className="absolute right-5 -mt-6 -translate-y-1/2 text-gray-500 text-sm select-none pointer-events-none">
                      @mahasiswa.unikom.ac.id
                    </span>
                    {form.email.includes('@') && (
                      <div className="text-xs text-red-500 mt-1">
                        No need to fill <b>@mahasiswa.unikom.ac.id</b> only Name and NIM
                      </div>
                    )}
                    {isNimEmailMismatch && (
                      <div className="text-xs text-red-500 mt-1">
                        NIM pada email dan NIM input tidak sama
                      </div>
                    )}
                  </div>

                  <InputField
                    placeholder="Teknik Informatika"
                    label="Majors"
                    type="text"
                    value={form.majors}
                    onChange={(e) => updateForm("majors", e.target.value)}
                  />

                  <InputField
                    placeholder="2023"
                    label="Years"
                    type="text"
                    value={form.years}
                    onChange={(e) => updateForm("years", e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Textarea
                    label="Emails"
                    placeholder="Enter Emails, one per line"
                    value={multipleEmails}
                    onChange={(e) => setMultipleEmails(e.target.value)}
                    rows={8}
                  />
                  {multipleEmails.includes('@') && (
                    <div className="text-xs text-red-500 mt-1">
                      No need to fill <b>@mahasiswa.unikom.ac.id</b>
                    </div>
                  )}
                </div>
              )}
            </DialogField>
          </div>

          <Card className="p-5">
            <TableField
              activePage="members"
              onPageChange={() => {}}
              showMenu={false}
              data={filteredUsers}
              filterRole={filterRole}
              filterSubriset={filterSubriset}
              filterStatus={filterStatus}
            />
          </Card>
        </div>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default Members;
