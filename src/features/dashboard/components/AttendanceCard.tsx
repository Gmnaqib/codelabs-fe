"use client"
import CardField from '@/components/custom-ui/CardField'
import Image from 'next/image'
import {CalendarDaysIcon } from '@heroicons/react/24/solid'


const AttendanceCard = () => {
  return (
    <CardField title="Attendance" icon={<CalendarDaysIcon />}>
        <div className="flex flex-col items-center">
          <Image src="/icon/attendance.png" alt='Icon Attendance' width={150} height={150} />
          <p className='text-center text-sm mt-5'>Welcome to Codelabs! You are successfully check in today. Dont forget to check out at 5 PM.</p>
        </div>
    </CardField>
  )
}

export default AttendanceCard
