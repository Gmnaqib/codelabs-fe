"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

const TimeInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    ref.current?.showPicker?.();
  };
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input ref={ref} type="time" value={value} onChange={onChange} onClick={handleClick} className="cursor-pointer" />
    </div>
  );
};
import {
  getAllTimeSettings,
  updateTimeSetting,
  TimeSetting,
} from "@/services/timeSetting/timeSettingService";

const CHECKIN_KEYS = ["checkin", "checkinlimit", "checkinlatelimit"] as const;
const CHECKOUT_KEYS = ["checkout", "checkoutlate"] as const;
const TIME_KEYS = [...CHECKIN_KEYS, ...CHECKOUT_KEYS] as const;
type TimeKey = typeof TIME_KEYS[number];
type FormState = Record<TimeKey, string>;

const TIME_LABELS: Record<TimeKey, string> = {
  checkin: "Check-in Start",
  checkinlimit: "Late Check-in",
  checkinlatelimit: "Last Check-in",
  checkout: "Check-out Start",
  checkoutlate: "Last Check-out",
};

const DAY_LABEL: Record<string, string> = {
  WEEKDAY: "Weekday (Mon – Fri)",
  SATURDAY: "Saturday (Sat)",
  WEEKEND: "Weekend (Sun)",
};

const normalizeTime = (t: string): string => {
  if (!t) return "";
  const [h, m] = t.split(":");
  return `${h.padStart(2, "0")}:${(m ?? "00").padStart(2, "0")}`;
};

const settingToForm = (s: TimeSetting): FormState => ({
  checkin: normalizeTime(s.checkin),
  checkinlimit: normalizeTime(s.checkinlimit),
  checkinlatelimit: normalizeTime(s.checkinlatelimit),
  checkout: normalizeTime(s.checkout),
  checkoutlate: normalizeTime(s.checkoutlate),
});

const SettingCard = ({
  setting,
  onSaved,
}: {
  setting: TimeSetting;
  onSaved: () => void;
}) => {
  const initial = settingToForm(setting);
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);

  const hasChanges = TIME_KEYS.some((key) => form[key] !== initial[key]);

  const set = (key: TimeKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTimeSetting(setting._id, form);
      toast.success(`${DAY_LABEL[setting.code] ?? setting.code} settings saved`);
      onSaved();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="bg-primary">
        <CardTitle className="flex items-center gap-2 text-white text-base">
          <div className="bg-white text-primary rounded-full p-1.5">
            <Cog6ToothIcon className="size-4" />
          </div>
          {DAY_LABEL[setting.code] ?? setting.code}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">

        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Check-in</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHECKIN_KEYS.map((key) => (
              <TimeInput
                key={key}
                label={TIME_LABELS[key]}
                value={form[key]}
                onChange={set(key)}
              />
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Check-out</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHECKOUT_KEYS.map((key) => (
              <TimeInput
                key={key}
                label={TIME_LABELS[key]}
                value={form[key]}
                onChange={set(key)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving || !hasChanges} className="md:w-fit" size="full">
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<TimeSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getAllTimeSettings();
      setSettings(data);
    } catch {
      toast.error("Failed to load time settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex flex-col gap-6">
          <p className="font-semibold text-lg md:text-xl">Attendance Time Settings</p>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : settings.length === 0 ? (
            <p className="text-gray-400 text-sm">No time settings found. Please add them via API first.</p>
          ) : (
            settings.map((s) => (
              <SettingCard key={s._id} setting={s} onSaved={fetchData} />
            ))
          )}
        </div>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default SettingsPage;
