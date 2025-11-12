import CardField from '@/components/custom-ui/CardField'
import SelectField from '@/components/custom-ui/SelectField'
import { TableField } from '@/components/custom-ui/TableField'
import { DataSelectRangkingsKPI } from '@/config/dashboard'
import React, { useState } from 'react'
import { TfiLayoutListThumbAlt } from 'react-icons/tfi'

const OrganizationSummary = ({ className }: { className?: string }) => {
    const [activePage, setActivePage] = useState("organization");
    const [filter, setFilter] = useState("highest")
    
    return (
        <div className={`${className}`}>
            <CardField title="Research Percentage" icon={<TfiLayoutListThumbAlt size={22}/>}>
            <div className="flex items-center gap-5 mb-4">
                <p>Sort By:</p>
                <SelectField
                    options={DataSelectRangkingsKPI}
                    value={filter}
                    onChange={(value) => setFilter(value)}
                />
            </div>
                <TableField
                    activePage={activePage}
                    onPageChange={setActivePage}
                    showMenu={true} 
                />
            </CardField>
        </div>
    )
}

export default OrganizationSummary
