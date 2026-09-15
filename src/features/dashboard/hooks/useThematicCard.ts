import { useEffect, useState } from 'react';
import { getTodayThematicSchedule } from '@/services/thematic/thematicService';
import { handleError } from '@/shared/services';

interface ThematicAssignedUser {
  _id: string;
  name: string;
}

export function useThematicCard() {
  const [topic, setTopic] = useState<string | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<ThematicAssignedUser[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTodayThematicSchedule();
        const today = data[0];
        setTopic(today?.description ?? null);
        setAssignedUsers(today?.assignedUsers ?? []);
      } catch (err) {
        setError(handleError(err));
        setTopic(null);
        setAssignedUsers([]);
      }
    };
    fetchData();
  }, []);

  return { topic, assignedUsers, error };
}
