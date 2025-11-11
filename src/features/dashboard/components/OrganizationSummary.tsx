import CardField from '@/components/custom-ui/CardField'
import { TableField } from '@/components/custom-ui/TableField'
import React, { useState } from 'react'
import { TfiLayoutListThumbAlt } from 'react-icons/tfi'

const OrganizationSummary = ({ className }: { className?: string }) => {
    const [activePage, setActivePage] = useState("organization");
    
    return (
        <div className={`${className}`}>
            <CardField title="Research Percentage" icon={<TfiLayoutListThumbAlt size={22}/>}>
            <p>asdsadsa</p>
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
