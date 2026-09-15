import { useEffect, useState } from 'react';
import { getOperationalRecordsToday } from '@/services/picket/picketService';
import { handleError } from '@/shared/services';

export function useOperationalPicketCard() {
  const [value, setValue] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOperationalRecordsToday();
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
