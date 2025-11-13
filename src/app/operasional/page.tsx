"use client";

import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import TableField from "@/components/custom-ui/TableField/TableField";
import InputField from "@/components/custom-ui/InputField";
import FilterMonth from "@/components/custom-ui/FilterMonth";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";

const Operasional = () => {
  const [activePage, setActivePage] = useState("Absensi");

  return (
    <ProtectedRoute>
      <div>
        <Card>
          <div className="flex gap-7">
            <InputField type="string" placeholder="Search by NIM or Name" />
            <FilterMonth />
          </div>
          <div className="mt-4 px-5">
            {/* Tidak perlu kirim data lagi */}
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
            />
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Operasional;
