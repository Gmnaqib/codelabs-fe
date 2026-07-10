"use client";
import { Card } from "@/components/ui/card";
import React from "react";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import OperationalTable from "@/features/operational/components/OperationalTable";

const Operasional = () => {
  return (
    <ProtectedRoute roles={['admin', 'minister of operation']}>
      <MotionWrapper>
        <Card>
          <div className="p-5">
            <OperationalTable />
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default Operasional;
