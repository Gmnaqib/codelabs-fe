import React from 'react'
import CardField from '@/components/custom-ui/CardField'
import { MegaphoneIcon } from '@heroicons/react/24/solid'

const AnnouncementCard = () => {
  return (
    <CardField title="Total Attendance" icon={<MegaphoneIcon />} bg>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col text-center gap-5">
              <p className='font-normal text-base'>Total Attendance</p>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-12">
                  <p className='col-span-5 text-left'>Present</p>
                  <p className='col-span-1'>:</p>
                  <p className='col-span-1 font-semibold'>0</p>
                </div>
                <div className="grid grid-cols-12">
                  <p className='col-span-5 text-left'>Sick</p>
                  <p className='col-span-1'>:</p>
                  <p className='col-span-1 font-semibold'>0</p>
                </div>
                <div className="grid grid-cols-12">
                  <p className='col-span-5 text-left'>Late Arrivals</p>
                  <p className='col-span-1'>:</p>
                  <p className='col-span-1 font-semibold'>0</p>
                </div>
                <div className="grid grid-cols-12">
                  <p className='col-span-5 text-left'>No Report</p>
                  <p className='col-span-1'>:</p>
                  <p className='col-span-1 font-semibold'>0</p>
                </div>
                <div className="grid grid-cols-12">
                  <p className='col-span-5 text-left'>SP</p>
                  <p className='col-span-1'>:</p>
                  <p className='col-span-1 font-semibold'>0</p>
                </div>
              </div>
            </div>
          </div>
        </CardField>
  )
}

export default AnnouncementCard
