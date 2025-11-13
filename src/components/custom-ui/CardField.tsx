import React, { ReactElement, ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CardFieldProps } from '@/types/CardFieldProps'


const CardField = (props: CardFieldProps) => {
  const { title, children, icon, noGap = false } = props
  return (
    <div className='flex flex-col h-full'>
      <Card className={`flex-1 ${noGap ? "gap-0" : "gap-6"}`}>
        <CardHeader>
          <CardTitle className='flex text-lg gap-3 items-center'>
           {icon && (
             <div className="bg-[rgb(0,208,255,0.1)] text-[#00D0FF] rounded-full p-1">
              {icon}
            </div>
           )}
            <div className={`${noGap? "text-sm text-ring" : ""}`}>
              {title}
            </div>
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