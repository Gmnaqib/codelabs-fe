import CardField from '@/components/custom-ui/CardField'
import { TableField } from '@/components/custom-ui/TableField'
import { BuildingOffice2Icon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'

const OrganizationSummary = ({ className }: { className?: string }) => {
    const [activePage, setActivePage] = useState("organization");
    
    return (
        <div className={`${className}`}>
            <CardField title="Organization Summary" icon={<BuildingOffice2Icon />}>
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
