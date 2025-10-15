"use client"
import InputField from '@/components/custom-ui/InputField'
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'
import TableField from '@/components/custom-ui/TableField'
import FilterMonth from '@/components/custom-ui/FilterMonth'

const Operasional = () => {
  const [activePage, setActivePage] = useState<string>("Absensi")

  const getHeaders = () => {
    switch (activePage) {
      case "Tematik":
        return ["NIM", "Nama"]
      case "Piket":
        return ["NIM", "Nama"]
      default:
        return ["NIM", "Nama"]
    }
  }

  return (
    <div className="">
      <Card className="p-4">
        <div className="flex gap-7">
          <InputField type="string" placeholder="Search by NIM or Name" />
          <FilterMonth />
        </div>
        <div className="mt-4">
          <TableField
            headers={getHeaders()}
            activePage={activePage}
            onPageChange={setActivePage}
          />
        </div>
      </Card>
    </div>
  )
}

export default Operasional
