import CardField from '@/components/custom-ui/CardField'
import Image from 'next/image'
import {CalendarDaysIcon } from '@heroicons/react/24/solid'

const AttendanceCard = () => {
  return (
    <CardField title="Attendance" icon={<CalendarDaysIcon />} bg>
        <div className="flex flex-col items-center">
          <Image src="/icon/attendance.png" alt='Icon Attendance' width={150} height={150} />
          <p className='text-center text-sm mt-5'>Welcome to Codelabs! You are successfully check in today. Dont forget to check out at 5 PM.</p>
          {/* <p className='text-center text-sm mt-5'>You have to be in CodeLabs to do attendance & If You will check out, you need check in first, please check in tomorrow on 6 AM - 10 AM.</p> */}
          {/* <p className='text-center text-sm mt-5'>You are successfully check out today. See you tomorrow!</p> */}
        </div>
    </CardField>
  )
}

export default AttendanceCard
