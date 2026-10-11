"use client";

import { useState } from "react";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { useTimeSettings } from "@/features/settings/hooks/useTimeSettings";
import TimeSettingsForm, {
  DAY_LABEL,
} from "@/features/settings/components/TimeSettingsForm";
import { Menubar } from "@/components/custom-ui/MenuBar";

const SettingsPage = () => {
  const { settings, loading, saveSetting } = useTimeSettings();
  const [active, setActive] = useState(0);
  const current = settings[active];
  const labels = settings.map((s) => DAY_LABEL[s.code] ?? s.code);

  return (
    <ProtectedRoute roles={["admin", "minister of operation"]}>
      <MotionWrapper>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-xl md:text-2xl">
              Attendance Time Settings
            </p>
            <p className="text-gray-500 text-sm">
              Set when members can check in and out, and when they count as
              late.
            </p>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : settings.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No time settings found. Please add them via API first.
            </p>
          ) : (
            <>
              <div className="[&_[data-slot=menubar]]:shadow-none [&_[data-slot=menubar-trigger]]:mb-0">
                <Menubar
                  menus={labels}
                  activeMenu={labels[active]}
                  onChange={(menu) => setActive(labels.indexOf(menu))}
                />
              </div>
              {current && (
                <TimeSettingsForm
                  key={current._id}
                  setting={current}
                  onSave={saveSetting}
                />
              )}
            </>
          )}
        </div>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default SettingsPage;
