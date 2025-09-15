"use client"
import CardField from '@/components/custom-ui/CardField'
import { formatJam, formatTanggal, getDayName } from '@/utils/date'
import React, { useEffect, useState } from 'react'
import { IoIosWarning } from 'react-icons/io'

const AttendanceCard = () => {
    const [waktu, setWaktu] = useState(new Date());

    useEffect(()=>{
        const interval = setInterval(()=>{
            setWaktu(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const hari = getDayName(waktu)
    const tanggal = formatTanggal(waktu)
    const jam = formatJam(waktu)

  return (
    <CardField title="Attendance" icon={<IoIosWarning size={22} />}>
        <div className="flex flex-col gap-3">
        <p className='text-center'>{`${hari}, ${tanggal}`}</p>
        <p className='font-semibold text-2xl text-center'>{jam} WIB</p>
        <p className='text-center text-sm mt-5'>Welcome to Codelabs! You are successfully check in today. Dont forget to check out at 5 PM. <span className='font-semibold text-[#2080D9]'>Learn More</span></p>
        </div>
    </CardField>
  )
}

export default AttendanceCard
