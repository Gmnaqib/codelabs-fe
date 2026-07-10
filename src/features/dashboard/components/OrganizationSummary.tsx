import React, { useState } from 'react'
import CardField from '@/components/custom-ui/CardField'
import OrganizationSummaryTable from '@/components/custom-ui/TableField/TableSection/OrganizationSummary'
import { BuildingOffice2Icon } from '@heroicons/react/24/solid'

const OrganizationSummary = ({ className }: { className?: string }) => {
    const [activePage, setActivePage] = useState("Attendance");

    return (
        <div className={`${className}`}>
            <CardField title="Organization Summary" icon={<BuildingOffice2Icon />}>
                <OrganizationSummaryTable
                    activePage={activePage}
                    onPageChange={setActivePage}
                    showMenu={true}
                />
            </CardField>
        </div>
    )
}

export default OrganizationSummary
