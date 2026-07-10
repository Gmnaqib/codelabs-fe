import { useEffect, useState } from 'react';
import { getTodayPicketSchedule } from '@/services/picket/picketService';
import { handleError } from '@/shared/services';
import type { PicketPerson } from '@/types/PicketPersonProps';

interface AssignedUser {
  _id: string;
  name: string;
}

interface Schedule {
  assignedUsers?: AssignedUser[];
}

export function usePicketCard() {
  const [picketData, setPicketData] = useState<PicketPerson[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await getTodayPicketSchedule()) as Schedule[];
        const withUsers = data.filter((d) => d.assignedUsers && d.assignedUsers.length > 0);
        const users: AssignedUser[] = withUsers.length > 0 ? withUsers[0].assignedUsers! : [];
        const names: PicketPerson[] = users.map((u) => ({
          name: u.name,
          userId: u._id,
        }));
        setPicketData(names);
      } catch (err) {
        setError(handleError(err));
        setPicketData([]);
      }
    };
    fetchData();
  }, []);

  return { picketData, error };
}
