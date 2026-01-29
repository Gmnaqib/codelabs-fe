"use client";

import { useEffect, useState } from "react";
import DialogField from "@/components/custom-ui/DialogField";
import { DropdownField } from "@/components/custom-ui/DropdownField";
import InputField from "@/components/custom-ui/InputField";
import { TableField } from "@/components/custom-ui/TableField";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { getAllUsers, createUser } from "@/services/users/userService";

type UserType = {
  nim: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subriset: string;
};

const Members = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All Role");
  const [filterSubriset, setFilterSubriset] = useState("All SubRiset");
  const [filterStatus, setFilterStatus] = useState("All Status");

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

      const mapped: UserType[] = data.map((u: any) => ({
        _id: u._id,
        nim: u.nim,
        name: u.name,
        email: u.email,
        role: u.role ? u.role : "Other",
        status: u.status || "Unknown",
        subriset: ["ui/ux", "mobile", "iot", "website", "game", "data"].includes(
          u.research?.toLowerCase()
        )
          ? u.research
          : "Other",
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
      const payload = {
        name: form.name,
        email: form.email,
        password: "password",
        nim: form.nim,
        majors: form.majors || "Unknown",
        years: form.years || "Unknown",
        role: form.role || "User",
      };

      await createUser(payload);

      await fetchData();
      alert("User created successfully!");

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
      alert("Failed to create member");
    }
  };

  return (
    <ProtectedRoute>
      <div className="w-full flex flex-col">

        {/* FILTERS */}
        <div className="flex w-full justify-between mb-4">
          <div className="flex gap-4">

            {/* SEARCH */}
            <InputField
              type="text"
              placeholder="Search by Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <DropdownField
              title={filterRole}
              menu={["All Role", "User", "Minister", "Admin", "President"]}
              onSelect={(v) => setFilterRole(v)}
            />

            <DropdownField
              title={filterSubriset}
              menu={[
                "All SubRiset",
                "UI/UX",
                "Mobile",
                "IOT",
                "Web",
                "Game",
                "Data",
                "Other",
              ]}
              onSelect={(v) => setFilterSubriset(v)}
            />

            <DropdownField
              title={filterStatus}
              menu={["All Status", "Active", "Inactive", "Graduated"]}
              onSelect={(v) => setFilterStatus(v)}
            />
          </div>

          <DialogField
            name="Create New Member"
            title="Create New Member"
            onSubmit={handleCreateMember}
          >
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

            <InputField
              placeholder="jhon.1023456@mahasiswa.unikom.ac.id"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />

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

            {/* <DropdownField
              title={form.role || "Select Role"}
              menu={[
                "Lecturer",
                "Admin",
                "User",
                "Minister of Operational",
                "Minister of Research",
                "Minister of Research and Operational",
                "Minister of and Branding",
                "Minister of Competition",
                "Minister of Branding",
                "President",
                "Vice President",
              ]}
              label="Role"
              onSelect={(val) => updateForm("role", val)}
            /> */}
          </DialogField>
        </div>

        <TableField
          activePage="members"
          onPageChange={() => {}}
          showMenu={false}
          data={filteredUsers}
        />

      </div>
    </ProtectedRoute>
  );
};

export default Members;
