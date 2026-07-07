import { useCallback, useEffect, useState } from 'react';
import { useTableStore } from '@/shared/state';
import { useOperationalStore } from '@/features/operational/state';
import { getAllUsers } from '@/services/users/userService';
import {
  getOperationalRecords,
  createOperationalRecord,
  deleteOperationalRecord,
} from '@/services/operational/operationalService';
import { handleError } from '@/shared/services';
import { WEEK_TO_DATE, getDateFromWeek } from '@/shared/constants';
import type { User, OperationalRecord } from '@/types/domain';
import type { ApiResponse } from '@/types';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function dateToWeek(day: number): number {
  const entries = Object.entries(WEEK_TO_DATE)
    .map(([week, startDay]) => [Number(week), startDay] as [number, number])
    .sort((a, b) => a[1] - b[1]);

  let week = entries[0][0];
  for (const [w, startDay] of entries) {
    if (day >= startDay) week = w;
  }
  return week;
}

function buildDate(tab: string, month: number, year: number, dayOrWeek: number): string {
  const day = tab === 'picket' ? getDateFromWeek(dayOrWeek) : dayOrWeek;
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function useOperationalTable() {
  const month = useTableStore((s) => s.month);
  const year = useTableStore((s) => s.year);
  const activeTab = useOperationalStore((s) => s.activeTab);
  const checked = useOperationalStore((s) => s.checked);
  const loading = useOperationalStore((s) => s.loading);
  const error = useOperationalStore((s) => s.error);
  const setChecked = useOperationalStore((s) => s.setChecked);
  const setRecordIds = useOperationalStore((s) => s.setRecordIds);
  const toggleChecked = useOperationalStore((s) => s.toggleChecked);
  const setLoading = useOperationalStore((s) => s.setLoading);
  const setError = useOperationalStore((s) => s.setError);

  const [users, setUsers] = useState<User[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const type = activeTab === 'absence' ? undefined : activeTab;

      const fetchedUsers = (await getAllUsers()) as User[];

      let records: OperationalRecord[] = [];
      if (type) {
        records = (await getOperationalRecords(type, undefined, year, month)) as OperationalRecord[];
      }

      const nextChecked: Record<string, boolean> = {};
      const nextRecordIds: Record<string, string> = {};

      for (const record of records) {
        const day = new Date(record.date).getDate();
        const dayOrWeek = activeTab === 'picket' ? dateToWeek(day) : day;
        const key = `${activeTab}-${record.userId}-${dayOrWeek}`;
        nextChecked[key] = true;
        nextRecordIds[key] = record._id;
      }

      setUsers(fetchedUsers);
      setChecked(nextChecked);
      setRecordIds(nextRecordIds);
    } catch (e) {
      setError(handleError(e));
    } finally {
      setLoading(false);
    }
  }, [activeTab, month, year, setLoading, setError, setChecked, setRecordIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = useCallback(
    async (userId: string, dayOrWeek: number) => {
      const key = `${activeTab}-${userId}-${dayOrWeek}`;
      const store = useOperationalStore.getState();
      const wasChecked = !!store.checked[key];
      const existingRecordId = store.recordIds[key];

      toggleChecked(key);

      if (!wasChecked) {
        try {
          const date = buildDate(activeTab, month, year, dayOrWeek);
          const created = (await createOperationalRecord({
            userId,
            type: activeTab,
            date,
          })) as ApiResponse<OperationalRecord>;

          const newId = created?.data?._id;
          if (newId) {
            setRecordIds({ ...useOperationalStore.getState().recordIds, [key]: newId });
          }
        } catch (e) {
          setError(handleError(e));
          toggleChecked(key);
        }
      } else {
        try {
          if (existingRecordId) {
            await deleteOperationalRecord(existingRecordId);
          }
        } catch (e) {
          setError(handleError(e));
          toggleChecked(key, existingRecordId);
        }
      }
    },
    [activeTab, month, year, toggleChecked, setRecordIds, setError]
  );

  const isChecked = useCallback(
    (userId: string, dayOrWeek: number) => !!checked[`${activeTab}-${userId}-${dayOrWeek}`],
    [activeTab, checked]
  );

  return { users, loading, error, handleToggle, isChecked };
}
