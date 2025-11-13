import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FaRegCalendar } from 'react-icons/fa6'
import { Calendar } from '../ui/calendar'

const FilterMonth = () => {
  return (
    <Popover>
        <PopoverTrigger className='flex items-center gap-8 border border-muted-foreground rounded-full px-8 bg-white'><p>October 2025</p><FaRegCalendar  size={20}/></PopoverTrigger>
        <PopoverContent>
          <Calendar/>
        </PopoverContent>
    </Popover>
  )
}

export default FilterMonth
