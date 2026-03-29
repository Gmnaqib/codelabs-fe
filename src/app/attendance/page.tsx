"use client";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { TableField } from "@/components/custom-ui/TableField";
import { Card } from "@/components/ui/card";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import React, { useState } from "react";

const Attendance = () => {
  const [activePage, setActivePage] = useState<string>("Permissions");
  return (
    <ProtectedRoute>
      <MotionWrapper>
        <Card>
          <div className="p-5">
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
              showMenu={true}
            />
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default Attendance;
