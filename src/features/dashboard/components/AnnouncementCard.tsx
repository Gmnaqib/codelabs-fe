import CardField from '@/components/custom-ui/CardField'
import { MegaphoneIcon } from '@heroicons/react/24/solid'
import React from 'react'

const AnnouncementCard = () => {
  return (
    <CardField title="Announcement" icon={<MegaphoneIcon />}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col text-center gap-2">
              <p className='font-normal text-base'>Competition</p>
              <p className='font-normal text-muted text-sm'>A new competition is now available! Check out the details and make sure you don’t miss the chance to participate.</p>
            </div>
            <div className="flex flex-col text-center gap-2">
              <p className='font-normal text-base'>Operational</p>
              <p className='font-normal text-muted text-sm'>Everything is running normally. No updates for now.</p>
            </div>
          </div>
        </CardField>
  )
}

export default AnnouncementCard
