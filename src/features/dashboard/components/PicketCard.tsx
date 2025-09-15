import CardField from '@/components/custom-ui/CardField'
import { Picket } from '@/config/dashboard'
import React from 'react'
import { IoIosWarning } from 'react-icons/io'
import Link from 'next/link'
import { Checkbox } from '@radix-ui/react-checkbox'

const PicketCard = () => {
  const picketData = Picket

  return (
    <CardField title="Picket Schedule Today" icon={<IoIosWarning size={22} />}>
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-lg">Vacuum Cleaner</p>
        <div className="flex flex-col gap-3">
          {picketData.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 justify-between">
              <label
                htmlFor={item.id}
                className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.name}
              </label>
              <Checkbox id={item.id} />
            </div>
          ))}
        </div>

        <p className="font-semibold text-lg">Table Cleaner & Research Tool Cleaner</p>
        <div className="flex flex-col gap-3">
          {picketData.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 justify-between">
              <label
                htmlFor={item.id}
                className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.name}
              </label>
              <Checkbox id={item.id} />
            </div>
          ))}
        </div>

        <p className="text-sm text-center mt-2">
          If someone is not picket, please contact the Ministry of Operations{" "}
          <span className="font-semibold text-[#2080D9]">
            <Link href="https://t.me/Erwinhafizz">Erwin</Link>
          </span>{" "}
          to be given a fine.
        </p>
      </div>
    </CardField>
  )
}

export default PicketCard
