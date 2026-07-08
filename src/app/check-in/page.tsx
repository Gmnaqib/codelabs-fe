"use client";

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import CheckInPanel from "@/features/checkin/components/CheckInPanel";

const CheckInPage = () => {
  return (
    // TODO(security-audit STEP 57): roles here are broader than src/config/menu.ts's
    // "/check-in" entry (menu.ts only lists 'admin'). Confirm which is the intended
    // source of truth before changing either side.
    <ProtectedRoute roles={['admin', 'minister of operation', 'lecturer', 'user']}>
      <CheckInPanel />
    </ProtectedRoute>
  );
};

export default CheckInPage;
