"use client"
import DialogField from '@/components/custom-ui/DialogField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import FilterMonth from '@/components/custom-ui/FilterMonth';
import InputField from '@/components/custom-ui/InputField';
import { TableField } from '@/components/custom-ui/TableField';
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea';
import ProtectedRoute from '@/features/login/components/ProtectedRoute';
import React, { useState } from 'react'
import { FaTasks } from "react-icons/fa";

const KPIScoring = () => {
  const [activePage, setActivePage] = useState<string>("research")
  return (
    <ProtectedRoute>
      <div className=''>
      <p className='text-muted-foreground mb-5'><span className='font-bold'>• 25%</span> of points from Attendance, <span className="font-bold">25%</span> of points from Branding, <span className="font-bold">25%</span> of points from Research, <span className="font-bold">5%</span> of points from Competition.</p>
      <Card>
        <div className="flex justify-between">
            <div className="flex items-center gap-3">
                <div className='bg-[rgb(0,208,255,0.1)] text-[#00D0FF] rounded-full p-2'>
                    <FaTasks size={20} />
                </div>
                <p className='font-semibold'>KPI Tasks</p>
            </div>
            <div className="flex gap-6">
                <div className="text-center">
                    <p className='text-muted-foreground'>Current Rank</p>
                    <p className='font-semibold text-2xl'>0</p>
                </div>
                <div className="text-center">
                    <p className='text-muted-foreground'>Current</p>
                    <p className='font-semibold text-2xl'>0%</p>
                </div>
                <div className="text-center">
                    <p className='text-muted-foreground'>Status</p>
                    <p className='font-semibold text-2xl text-red-400'>Danger</p>
                </div>
            </div>
        </div>
        <div className="flex justify-between">
          <FilterMonth />
          <div className="">
            <DialogField name="Add New Plan" title="Add New Plan" >
              <div className="flex flex-col gap-5">
                <InputField type="string" placeholder="Ex: Learn how to make responsive web" label='Title' />
                <div className="flex gap-5">
                  <DropdownField key="week" title="Week" menu={["Week 1", "Week 2", "Week 3", "Week4"]} label='Week'/>
                  <DropdownField key="progress" title="Progress" menu={["Finished", "Unfinished"]} label='Progress'/>
                </div>
                <div className="">
                  <InputField type="string" placeholder="Ex: https://github.com/unikom-codelabs/" label='Problem' />
                </div>
                <Textarea label="Deskripsi Masalah" placeholder="Ex: Ada kendala pada fitur upload gambar..." />
              </div>
            </DialogField>
          </div>
        </div>
        <div className="px-5">
          <TableField 
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={true} 
          />
        </div>
      </Card>
    </div>
    </ProtectedRoute>
  )
}

export default KPIScoring
