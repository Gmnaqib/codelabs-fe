"use client";

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import CheckInPanel from "@/features/checkin/components/CheckInPanel";

const CheckInPage = () => {
  return (
    <ProtectedRoute roles={['admin', 'minister of operation', 'lecturer', 'user']}>
      <CheckInPanel />
    </ProtectedRoute>
  );
};

export default CheckInPage;
