"use client";

import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { useTimeSettings } from "@/features/settings/hooks/useTimeSettings";
import TimeSettingsForm from "@/features/settings/components/TimeSettingsForm";

const SettingsPage = () => {
  const { settings, loading, saveSetting } = useTimeSettings();

  return (
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
