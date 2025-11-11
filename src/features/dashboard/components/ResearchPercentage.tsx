import CardField from '@/components/custom-ui/CardField'
import DoughnutChart from '@/components/custom-ui/DoughnutChart'
import FilterMonth from '@/components/custom-ui/FilterMonth'
import React from 'react'
import { TfiLayoutListThumbAlt } from 'react-icons/tfi'

const ResearchPercentage = () => {
  return (
     <CardField title="Research Percentage" icon={<TfiLayoutListThumbAlt size={22}/>}>
        <div className="flex flex-col gap-2">
            <FilterMonth/>
            <DoughnutChart/>
            <p className='text-center text-ring'>1 of 30 members doing research this month</p>
        </div>
     </CardField>
  )
}

export default ResearchPercentage
