import { useEffect, useState } from 'react';
import { getMeResearchRecords } from '@/services/research/researchService';
import { handleError } from '@/shared/services';

interface ResearchRecord {
  progress: string;
}

export function useInProgressCard() {
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fetchData = async () => {
      try {
        const records = (await getMeResearchRecords(year, month)) as ResearchRecord[];
        setTotal(records.length);
        setActive(records.filter((item) => item.progress === 'unfinished').length);
        setCompleted(records.filter((item) => item.progress === 'finished').length);
      } catch (err) {
        setError(handleError(err));
      }
    };
    fetchData();
  }, []);

  return { total, active, completed, error };
}
