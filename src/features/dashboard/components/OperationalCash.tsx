import React from 'react';
import Link from 'next/link';
import CardField from '@/components/custom-ui/CardField';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { useOperationalCashCard } from '@/features/dashboard/hooks';

const OperationalCash = () => {
  const { totalKas, loading } = useOperationalCashCard();

  function formatKas(kas: string) {
    if (!kas || kas === '-') return '-';
    const num = kas.replace(/[^\d]/g, '');
    if (!num) return '-';
    const formatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp ${formatted}`;
  }

  return (
    <CardField title="Total Operational Cash" icon={<BanknotesIcon />}>
      <div className="flex w-full flex-col gap-8">
        <p className='font-semibold text-2xl text-center'>{loading ? '...' : formatKas(totalKas)}</p>
        <Link href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRk2Uf9PCohnVcHGeGa7JZsWUaKbL6gAjXYvNHz6im51YUqJ_V7Qc0KUzClKOi2eKdfY6iuyOW1XBFV/pub?gid=1470408104&output=csv" className='text-primary text-base text-center'>See More</Link>
      </div>
    </CardField>
  );
};

export default OperationalCash;
