import { useEffect, useState } from 'react';
import { fetchCashBillsData } from '@/utils/fetchCashBills';
import { handleError } from '@/shared/services';

export function useOperationalCashCard() {
  const [totalKas, setTotalKas] = useState('-');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTotalKas() {
      try {
        const data = await fetchCashBillsData();
        const summaryRow = data[data.length - 1];
        setTotalKas(summaryRow?.['Total KAS'] || summaryRow?.['TOTAL'] || summaryRow?.['Total'] || '-');
      } catch (err) {
        setError(handleError(err));
        setTotalKas('-');
      } finally {
        setLoading(false);
      }
    }
    fetchTotalKas();
  }, []);

  return { totalKas, loading, error };
}
