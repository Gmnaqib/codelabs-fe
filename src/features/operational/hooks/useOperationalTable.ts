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
import { getWeekOfMonth, toWIB } from '@/shared/utils';
import type { User, OperationalRecord } from '@/types/domain';
import type { ApiResponse } from '@/types';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function buildDate(month: number, year: number, day: number): string {
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
        const day = toWIB(new Date(record.date)).getUTCDate();
        const dayOrWeek = activeTab === 'picket' ? getWeekOfMonth(day, year, month) : day;
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
          const date = buildDate(month, year, dayOrWeek);
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
