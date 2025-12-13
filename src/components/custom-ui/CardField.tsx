import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CardFieldProps } from '@/types/CardFieldProps'
import { DropdownField } from './DropdownField'

const CardField = (props: CardFieldProps) => {
  const { title, children, icon, noGap = false, filterYear = false  } = props

  const years = Array.from(
    { length: new Date().getFullYear() - 2022 + 1 },
    (_, i) => String(new Date().getFullYear() - i)
  )

  const sizedIcon = icon
    ? React.cloneElement(icon, {
        className: "size-4 " + (icon.props.className || "")
      })
    : null
  
  return (
    <div className='flex flex-col h-full'>
      <Card className={`flex-1 ${noGap ? "gap-0" : "gap-6"}`}>
        <CardHeader className='bg-primary'>
          <CardTitle className='flex justify-between items-center'>
            <div className="flex gap-2 items-center">
              {sizedIcon && (
                <div className="bg-white text-primary text-sm rounded-full p-1.5">
                  {sizedIcon}
                </div>
              )}

              <div className={`${noGap ? "text-sm text-ring" : "text-white text-base"}`}>
                {title}
              </div>
            </div>

            {filterYear && (
              <DropdownField
                title="2025"
                menu={years}
              />
            )}

          </CardTitle>
        </CardHeader>

        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export default CardField
