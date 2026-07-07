import { useEffect, useState } from 'react';
import { getOperationalRecordsToday } from '@/services/picket/picketService';
import { handleError } from '@/shared/services';

export function useOperationalPicketCard() {
  const [value, setValue] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      try {
        const data = await getOperationalRecordsToday(year, month);
        setValue(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        setError(handleError(err));
        setValue(0);
      }
    };
    fetchData();
  }, []);

  return { value, error };
}
