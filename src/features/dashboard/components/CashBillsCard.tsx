import React from 'react'
import Link from 'next/link'
import CardField from '@/components/custom-ui/CardField'
import { BanknotesIcon } from '@heroicons/react/24/solid'

const CashBillsCard = () => {
  return (
    <CardField title="Cash Bills Progress" icon={<BanknotesIcon />} bg>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col text-center">
              <p className='text-sm text-muted'>Cash Bills</p>
              <p className='font-medium text-2xl'>Rp165,000</p>
            </div>
            <div className="flex flex-col text-center">
              <p className='text-sm text-muted'>Picket</p>
              <p className='font-medium text-2xl'>Rp0</p>
            </div>
            <div className="">
              <p className='text-sm text-center'>To pay bills, you can contact <Link href="https://t.me/candylolipoppp" className='font-semibold text-[#2080D9]'>Yolanda Belva</Link> through online payments or directly in the lab.</p>
            </div>
          </div>
        </CardField>
  )
}

export default CashBillsCard
