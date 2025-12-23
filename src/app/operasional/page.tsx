"use client";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import TableField from "@/components/custom-ui/TableField/TableField";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";

const Operasional = () => {
  const [activePage, setActivePage] = useState("Absensce");

  return (
    <ProtectedRoute>
      <div>
        <Card>
          <div className="p-5">
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
