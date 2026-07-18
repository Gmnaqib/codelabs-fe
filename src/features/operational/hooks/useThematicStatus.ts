import { useCallback, useEffect, useState } from 'react';
import { useTableStore } from '@/shared/state';
import { getAllTimeSettings } from '@/services/timeSetting/timeSettingService';
import type { TimeSetting } from '@/services/timeSetting/timeSettingService';
import { TIME_CONFIG } from '@/shared/constants/time';
import { truncateToWIBDay, wibDayStart, wibNow } from '@/shared/utils';

export type ThematicStatus = 'thematic' | 'no-thematic' | 'not-yet' | 'future';

function getDayCode(wib: Date): 'WEEKDAY' | 'WEEKEND' | 'SUNDAY' {
  const day = wib.getUTCDay();
  if (day === 0) return 'SUNDAY';
  if (day === 6) return 'WEEKEND';
  return 'WEEKDAY';
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

export function computeThematicStatus(
  settings: TimeSetting[],
  isChecked: boolean,
  day: number,
  year: number,
  month: number
): ThematicStatus {
  if (isChecked) return 'thematic';

  const now = wibNow();
  const todayStart = truncateToWIBDay(now);
  const cellStart = wibDayStart(year, month, day);

  // A day later than today hasn't happened yet — there is nothing to report,
  // so it should render as blank rather than a false "No Thematic".
  if (cellStart > todayStart) {
    return 'future';
  }

  if (cellStart === todayStart) {
    const setting = settings.find((s) => s.code === getDayCode(now));
    if (setting) {
      const checkoutMinutes = toMinutes(setting.checkout) + TIME_CONFIG.lateAfterMinutes;
      const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
      if (nowMinutes < checkoutMinutes) {
        return 'not-yet';
      }
    }
  }

  return 'no-thematic';
}

export function useThematicStatus() {
  const month = useTableStore((s) => s.month);
  const year = useTableStore((s) => s.year);
  const [settings, setSettings] = useState<TimeSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllTimeSettings()
      .then((res) => {
        if (!cancelled) setSettings(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getStatus = useCallback(
    (isChecked: boolean, day: number): ThematicStatus =>
      computeThematicStatus(settings, isChecked, day, year, month),
    [settings, month, year]
  );

  return { getStatus, loading };
}
