"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import CardField from '@/components/custom-ui/CardField'
import InputField from '@/components/custom-ui/InputField'
import { TableField } from '@/components/custom-ui/TableField'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React from 'react'
import { BsFillPeopleFill } from 'react-icons/bs'

const Assessments = () => {
  return (
    <ProtectedRoute>
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center">
                <InputField
                type="string"
                placeholder="Search by Name"
                />
                <CalendarMonthYearPicker/>
            </div>
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">
                    <CardField title="Average Points" icon={<BsFillPeopleFill size={22} />}>
                        <div className="flex gap-8 items-center justify-center">
                            <p className="font-bold text-3xl text-orange-400">35.78%</p>
                            <div className="bg-slate-400 w-0.5 h-10"></div>
                            <p className='font-bold text-3xl text-orange-400'>NotSafe</p>
                        </div>
                    </CardField>
                </div>
                <CardField title="Total Good">
                    <p className="font-bold text-3xl">0</p>
                </CardField>
                <CardField title="Total Standard">
                    <p className="font-bold text-3xl">0</p>
                </CardField>
                <CardField title="Total Not Safe">
                    <p className="font-bold text-3xl">7</p>
                </CardField>
                <CardField title="Total Danger">
                    <p className="font-bold text-3xl">21</p>
                </CardField>
            </div>
             <TableField
            activePage="assessments"
            onPageChange={() => {}}
            showMenu={false}
            data={[
                { rank: 1, name: "Ramdani", monthly: "82", status: "Good", detail: "Great performance" },
                { rank: 2, name: "tes", monthly: "60", status: "Standard", detail: "Average performance" },
            ]}
        />
        </div>
    </ProtectedRoute>
  )
}

export default Assessments
