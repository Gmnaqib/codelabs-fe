import CardField from '@/components/custom-ui/CardField'
import DialogField from '@/components/custom-ui/DialogField'
import React from 'react'
import { IoIosWarning } from 'react-icons/io'

const AnnouncementCard = () => {
  return (
    <CardField title="Announcement" icon={<IoIosWarning size={22} />}>
          <div className="flex flex-col gap-4">
            <div className="">
              <p className='font-semibold text-sm'>08 April 2025</p>
              <p className='font-normal text-sm'>After you successfully check in & check out, You can check your total attendance in KPI Scoring and Tab Operational.</p>
            </div>
            <div className="">
              <p className='font-semibold text-sm'>08 April 2025</p>
              <p className='font-normal text-sm'>You can CheckIn & CheckOut When<br />Wifi : Codelabs <br />Location : UNIKOM Codelabs <br />CheckIn : 06.00 - 10.00 AM <br />CheckOut : 05.00 - 11.59 PM</p>
            </div>
            <DialogField name='Read More' title='Announcement'>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogField>
          </div>
        </CardField>
  )
}

export default AnnouncementCard
