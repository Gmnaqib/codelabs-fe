"use client";

import { useEffect, useState } from "react";
import DialogField from "@/components/custom-ui/DialogField";
import { DropdownField } from "@/components/custom-ui/DropdownField";
import InputField from "@/components/custom-ui/InputField";
import MembersTable from "@/features/members/components/MembersTable";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { createUser, multipleRegisterUsers } from "@/services/users/userService";
import { getProducts, type RawProductRecord } from "@/services/product/productsService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { useTableStore } from "@/shared/state";

const Members = () => {
  const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All Role");
  const [filterSubriset, setFilterSubriset] = useState("All SubRiset");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterProduct, setFilterProduct] = useState("All Product");
  const [products, setProducts] = useState<RawProductRecord[]>([]);
  const [mode, setMode] = useState<'Register' | 'Multiple Register'>('Register');
  const [multipleEmails, setMultipleEmails] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

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

      setFetchTrigger(Date.now());
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
      setFetchTrigger(Date.now());
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

          <div className="flex w-full flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="w-full sm:w-auto">
                <InputField
                  type="text"
                  placeholder="Search by Name"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setGlobalSearchQuery(e.target.value);
                  }}
                />
              </div>

              <div className="w-full sm:w-auto">
                <DropdownField
                  title={filterRole}
                  menu={["All Role", "admin", "lecturer", "president", "vice president", "minister of research", "minister of competition", "minister of branding", "minister of operation", "user"]}
                  onSelect={(v) => {
                    setFilterRole(v);
                  }}
                  className="w-full sm:w-auto"
                />
              </div>

              <div className="w-full sm:w-auto">
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
                  }}
                  className="w-full sm:w-auto"
                />
              </div>

              <div className="w-full sm:w-auto">
                <DropdownField
                  title={filterStatus}
                  menu={["All Status", "active", "inactive", "graduated"]}
                  onSelect={(v) => {
                    setFilterStatus(v);
                  }}
                  className="w-full sm:w-auto"
                />
              </div>

              <div className="w-full sm:w-auto">
                <DropdownField
                  title={filterProduct}
                  menu={["All Product", ...products.map((p) => p.name)]}
                  onSelect={(v) => {
                    setFilterProduct(v);
                  }}
                  className="w-full sm:w-auto"
                />
              </div>
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
            <MembersTable
              filterRole={filterRole}
              filterSubriset={filterSubriset}
              filterStatus={filterStatus}
              filterProduct={filterProduct}
              products={products}
              fetchTrigger={fetchTrigger}
            />
          </Card>
        </div>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default Members;
