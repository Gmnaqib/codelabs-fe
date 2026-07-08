"use client";

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { useTimeSettings } from "@/features/settings/hooks/useTimeSettings";
import TimeSettingsForm from "@/features/settings/components/TimeSettingsForm";

const SettingsPage = () => {
  const { settings, loading, saveSetting } = useTimeSettings();

  return (
    // TODO(security-audit STEP 57): src/config/menu.ts's "/settings" entry lists
    // ['admin', 'minister of operation'], but this guard is 'admin' only, so a
    // 'minister of operation' user sees the sidebar link but gets bounced to '/'.
    // Confirm intended roles before widening this guard.
    <ProtectedRoute roles={['admin']}>
      <MotionWrapper>
        <div className="flex flex-col gap-6">
          <p className="font-semibold text-lg md:text-xl">Attendance Time Settings</p>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : settings.length === 0 ? (
            <p className="text-gray-400 text-sm">No time settings found. Please add them via API first.</p>
          ) : (
            settings.map((s) => (
              <TimeSettingsForm key={s._id} setting={s} onSave={saveSetting} />
            ))
          )}
        </div>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default SettingsPage;
