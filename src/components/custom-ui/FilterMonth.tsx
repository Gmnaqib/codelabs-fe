import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FaRegCalendar } from 'react-icons/fa6'

const FilterMonth = () => {
  return (
    <Popover>
        <PopoverTrigger className='flex items-center gap-8 border border-muted-foreground rounded-full px-8'><p>October 2025</p><FaRegCalendar  size={20}/></PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  )
}

export default FilterMonth
