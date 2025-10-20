"use client"
import InputField from '@/components/custom-ui/InputField'
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'
import TableField from '@/components/custom-ui/TableField/TableField'
import FilterMonth from '@/components/custom-ui/FilterMonth'

const Operasional = () => {
  const [activePage, setActivePage] = useState<string>("Absensi")

  return (
    <div className="">
      <Card>
        <div className="flex gap-7">
          <InputField type="string" placeholder="Search by NIM or Name" />
          <FilterMonth />
        </div>
        <div className="mt-4">
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
          />
        </div>
      </Card>
    </div>
  )
}

export default Operasional
