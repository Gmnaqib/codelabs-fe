import React, { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogFieldProps } from '@/types/DialogFieldProps'



const DialogField = (props: DialogFieldProps) => {
  const { name, title, children } = props
  return (
    <Dialog>
      <div className="w-full text-center">
        <DialogTrigger className='bg-[#2080d9] rounded-full text-white font-medium text-lg py-1 w-fit px-5 hover:cursor-pointer'>{name}</DialogTrigger>
      </div>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{title}</DialogTitle>
          <DialogDescription>
            {children}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default DialogField