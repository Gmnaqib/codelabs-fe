"use client";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { Card } from "@/components/ui/card";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import React from "react";
import AttendanceTable from "@/features/attendance/components/AttendanceTable";

const Attendance = () => {
  return (
    <ProtectedRoute roles={['admin', 'minister of operation', 'lecturer']}>
      <MotionWrapper>
        <Card>
          <div className="p-5">
            <AttendanceTable showMenu={true} />
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default Attendance;
