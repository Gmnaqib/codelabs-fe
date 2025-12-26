"use client";

import { TableField } from "@/components/custom-ui/TableField";
import { Card } from "@/components/ui/card";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import React, { useState } from "react";

const Attendance = () => {
  const [activePage, setActivePage] = useState<string>("Permissions");
  
  const [search, setSearch] = useState("");



  return (
    <ProtectedRoute>
      <Card>
        <div className="p-5">
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={true}
            searchQuery={search}
          />
        </div>
      </Card>
    </ProtectedRoute>
  );
};

export default Attendance;
