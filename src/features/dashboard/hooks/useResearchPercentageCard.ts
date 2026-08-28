import { useEffect, useState } from 'react';
import { getAllResearchRecords } from '@/services/research/researchService';
import { getAllUsers } from '@/services/users/userService';
import { handleError } from '@/shared/services';

interface UserIdObj {
  _id: string;
}

interface ResearchRecord {
  userId?: UserIdObj;
}

export function useResearchPercentageCard(selectedMonth: number, selectedYear: number) {
  const [totalUsers, setTotalUsers] = useState(0);
  const [allResearchUsers, setAllResearchUsers] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, research] = await Promise.all([
          getAllUsers({ activeOnly: true }) as Promise<unknown[]>,
          getAllResearchRecords(selectedYear, selectedMonth) as Promise<ResearchRecord[]>,
        ]);

        setTotalUsers(users.length);

        const uniqueIds = new Set(research.map((r) => r.userId?._id));
        setAllResearchUsers(uniqueIds.size);
      } catch (err) {
        setError(handleError(err));
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  return { totalUsers, allResearchUsers, error };
}
