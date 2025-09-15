import SelectField from '@/components/custom-ui/SelectField'
import { DataSelectRangkingsKPI, RangkingsKPI } from '@/config/dashboard'
import Image from 'next/image'
import React, { useState } from 'react'

const KPIRangkings = () => {
    const [filter, setFilter] = useState("highest")

    const sortedRangkings = [...RangkingsKPI].sort((a, b) => {
    const getPoint = (p: string) => parseFloat(p.replace(",", ".").replace("%", ""))

    if (filter === "highest") {
      return getPoint(b.point) - getPoint(a.point)
    } else {
      return getPoint(a.point) - getPoint(b.point)
    }
    })
    
  return (
    <>
        <div className="flex justify-between items-center">
            <p className='font-semibold'>KPI Rangkings</p>
            <SelectField
                options={DataSelectRangkingsKPI}
                value={filter}
                onChange={(value) => setFilter(value)}
            />
            </div>
        <div className="max-h-64 overflow-y-auto flex flex-col gap-4 scrollbar-none">
        {sortedRangkings.map((item, index) => (
            <div key={index} className="flex gap-3">
            <div className="relative">
                <Image src={item.src} alt='profile' width={50} height={50} className='rounded-full' />
                <div className="absolute flex justify-center items-center top-0 right-0 -mr-1.5 bg-[#2080D9] w-5 h-5 rounded-full">
                <div className="">
                    <p className='text-xs text-white font-semibold'>{filter === "highest" ? index + 1 : sortedRangkings.length - index}</p>
                </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="w-full">
                <p className='text-sm'>{item.nama}</p>
                <p className='font-semibold text-[#2080D9] text-sm'>{item.point}</p>
                </div>
            </div>
            </div>
        ))}
        </div>
     </>
  )
}

export default KPIRangkings
