import React, { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useState } from 'react';
import { DropdownField } from './DropdownField';
import { CardFieldProps } from '@/types/CardFieldProps';
import Image from 'next/image';

const CardField = (props: CardFieldProps) => {
  const { title, children, icon, noGap = false, filterYear = false, bg = false  } = props

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2022 + 1 },
    (_, i) => String(currentYear - i)
  );
  const [selectedYear, setSelectedYear] = useState(String(currentYear));

  const sizedIcon = icon
    ? React.cloneElement(icon, {
        className: "size-4 " + (icon.props.className || "")
      })
    : null
    
  return (
    <div className='flex flex-col h-full relative'>
      <Card className={`flex-1 ${noGap ? "gap-0" : "gap-6"}`}>
        {bg && (
          <>
            <Image src="/icon/bg-outline-top.png" alt='outline' width={100} height={100} className='absolute top-9 left-0 w-96'/>
            <Image src="/icon/bg-outline-bottom.png" alt='outline' width={100} height={100} className='absolute right-0 bottom-0 w-96'/>
          </>
        )}
          <CardHeader className='bg-primary'>
            <CardTitle className='flex justify-between items-center'>
              <div className="flex gap-2 items-center">
                {sizedIcon && (
                  <div className="bg-white text-primary text-sm rounded-full p-1.5">
                    {sizedIcon}
                  </div>
                )}

                <div className={`${noGap ? "text-sm text-white" : "text-white text-base"}`}>
                  {title}
                </div>
              </div>

              {filterYear && (
                <DropdownField
                  title={selectedYear}
                  menu={years}
                  white={true}
                  onChange={setSelectedYear}
                />
              )}

            </CardTitle>
          </CardHeader>

          <CardContent className='z-10 flex-1 flex flex-col'>
            {typeof children === 'function'
              ? (children as (year: string) => ReactNode)(selectedYear)
              : children}
          </CardContent>
      </Card>
    </div>
  )
}

export default CardField
