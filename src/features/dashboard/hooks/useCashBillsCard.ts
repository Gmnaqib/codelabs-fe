import { useEffect, useState } from 'react';
import { getMe } from '@/services/users/userService';
import { fetchCashBillsData, type CashBill } from '@/utils/fetchCashBills';
import { handleError } from '@/shared/services';

export function useCashBillsCard() {
  const [cash, setCash] = useState('-');
  const [picket, setPicket] = useState('-');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getMe();
        const data: CashBill[] = await fetchCashBillsData();
        const userNim = user.nim?.toString().trim().toLowerCase();
        const row = data.find((r) => r['NIM']?.toString().trim().toLowerCase() === userNim);
        setCash(
          row?.['TOTAL']?.toString() ||
            row?.['Total KAS']?.toString() ||
            row?.['Total']?.toString() ||
            'Rp0'
        );
        setPicket(
          row?.['Denda Piket']?.toString() ||
            row?.['Denda piket']?.toString() ||
            row?.['Denda']?.toString() ||
            'Rp0'
        );
      } catch (err) {
        setError(handleError(err));
        setCash('-');
        setPicket('-');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { cash, picket, loading, error };
}
