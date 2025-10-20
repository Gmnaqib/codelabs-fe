"use client"
import DialogField from '@/components/custom-ui/DialogField'
import { DropdownField } from '@/components/custom-ui/DropdownField'
import FilterMonth from '@/components/custom-ui/FilterMonth'
import InputField from '@/components/custom-ui/InputField'
import { TableField } from '@/components/custom-ui/TableField'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'

const WeeklyReport = () => {
   const [activePage, setActivePage] = useState<string>("Absensi")
  return (
    <div>
      <Card>
          <div className="flex w-full justify-between">
            <div className="flex gap-7">
              <FilterMonth />
              <DropdownField key="week" title="Week" menu={["All", "Week 1", "Week 2", "Week 3", "Week 4"]}/>
              <DropdownField key="progress" title="Progress" menu={["All", "Finished", "Unfinished"]} />
            </div>
            <div>
              <DialogField name="Add New Plan" title="Add New Plan" >
                <div className="flex flex-col gap-5">
                  <InputField type="string" placeholder="Ex: Learn how to make responsive web" label='Title' />
                  <div className="flex gap-5">
                    <DropdownField key="week" title="Week" menu={["Week 1", "Week 2", "Week 3", "Week4"]} label='Week'/>
                    <DropdownField key="progress" title="Progress" menu={["Finished", "Unfinished"]} label='Progress'/>
                  </div>
                  <div className="">
                    <InputField type="string" placeholder="Ex: https://github.com/unikom-codelabs/" label='Problem' />
                  </div>
                  <Textarea label="Deskripsi Masalah" placeholder="Ex: Ada kendala pada fitur upload gambar..." />
                  </div>
              </DialogField>
            </div>
          </div>
          <TableField 
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={false} 
          />          
      </Card>
    </div>
  )
}

export default WeeklyReport
