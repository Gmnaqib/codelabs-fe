import CardField from "@/components/custom-ui/CardField";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useCashBillsCard } from "@/features/dashboard/hooks";

const CashBillsCard = () => {
  const { cash, picket, loading } = useCashBillsCard();

  // Fungsi untuk konversi string "Rp90,000" ke number 90000
  function parseRupiah(str: string) {
    if (!str) return 0;
    return parseInt(str.replace(/[^\d]/g, ""), 10) || 0;
  }

  const total = parseRupiah(cash) + parseRupiah(picket);
  const isUnsafe = total >= 150000;

  return (
    <CardField title="Cash Bills Progress" icon={<BanknotesIcon />} bg>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col text-center">
          <p className='text-sm text-muted'>Cash Bills</p>
          <p className='font-medium text-2xl'>{loading ? '...' : cash}</p>
        </div>
        <div className="flex flex-col text-center">
          <p className='text-sm text-muted'>Picket</p>
          <p className='font-medium text-2xl'>{loading ? '...' : picket}</p>
        </div>
        <div className="">
          <p className='text-sm text-center z-50'>To pay bills, you can contact <Link href="https://t.me/candylolipoppp" className='font-semibold text-[#2080D9]'>Yolanda Belva</Link> through online payments or directly in the lab.</p>
        </div>
      </div>
      <div className="flex justify-center mt-1">
        {!loading && (
          <span className={`text-destructive ${isUnsafe ? 'text-red-700' : 'text-green-700'}`}>
            {isUnsafe ? 'UNSAFE' : 'SAFE'}
          </span>
        )}
      </div>
    </CardField>
  );
};

export default CashBillsCard;
