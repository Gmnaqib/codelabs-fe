"use client"
import CardField from '@/components/custom-ui/CardField'
import Link from 'next/link'
import React from 'react'
import { IoIosWarning } from 'react-icons/io'

const CashBillsCard = () => {
  return (
    <CardField title="Cash Bills Progress" icon={<IoIosWarning size={22} />}>
          <div className="flex flex-col gap-5">
            <div className="flex justify-around">
              <div className="flex flex-col gap-2 text-center">
                <p className='text-sm text-[#7F7F7F]'>Cash Bills</p>
                <p className='font-semibold text-2xl'>Rp165,000</p>
              </div>
              <div className="bg-slate-400 w-0.5 h-14"></div>
              <div className="flex flex-col gap-2 text-center">
                <p className='text-sm text-[#7F7F7F]'>Picket</p>
                <p className='font-semibold text-2xl'>Rp0</p>
              </div>
            </div>
            <div className="">
              <p className='text-sm text-center'>To pay bills, you can contact <Link href="https://t.me/candylolipoppp" className='font-semibold text-[#2080D9]'>Yolanda</Link> or <Link href="https://t.me/Haikalimanf" className='font-semibold text-[#2080D9]'>Haikal</Link> through online payments or directly in the lab.</p>
            </div>
          </div>
        </CardField>
  )
}

export default CashBillsCard
