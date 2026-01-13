  import { Menubar } from '@/components/custom-ui/MenuBar';
  import React from 'react'
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
  import { Checkbox } from '@/components/ui/checkbox';
  import DialogField from '@/components/custom-ui/DialogField';
import { picketschedule } from '../../headerConfig';
import { ReportTableProps } from '@/types/ReportTableProps';

  const PicketScheduleTable = ({
    activePage,
    onPageChange,
    showMenu = true,
  }: ReportTableProps) => {
    const picketHeaders = picketschedule[activePage] ?? [];

    return (
      <div>
        {showMenu && (
          <Menubar
            menus={Object.keys( picketschedule )}
            activeMenu={activePage}
            onChange={onPageChange}
          />
        )}

        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              {picketHeaders.map((header, i) => (
                <TableHead key={i}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
                  <TableCell className="text-center">Ramdani</TableCell>
                  <TableCell className="text-center"><Checkbox /></TableCell>
                  <TableCell className="text-center">
                    <div className="">
                      <DialogField
                      variant='outline'
                      name="Swapping"
                      title="Swapping"
                      size="sm">
                        <p>das</p>
                    </DialogField>
                    </div>
                  </TableCell>
              </TableRow>
            <TableRow>
                  <TableCell className="text-center">Ramdani</TableCell>
                  <TableCell className="text-center"><Checkbox /></TableCell>
                  <TableCell className="text-center">
                    <div className="">
                      <DialogField
                      variant='outline'
                      name="Swapping"
                      title="Swapping"
                      size="sm">
                        <p>das</p>
                    </DialogField>
                    </div>
                  </TableCell>
              </TableRow>
            <TableRow>
                  <TableCell className="text-center">Ramdani</TableCell>
                  <TableCell className="text-center"><Checkbox /></TableCell>
                  <TableCell className="text-center">
                    <div className="">
                      <DialogField
                      variant='outline'
                      name="Swapping"
                      title="Swapping"
                      size="sm">
                        <p>das</p>
                    </DialogField>
                    </div>
                  </TableCell>
              </TableRow>
            <TableRow>
                  <TableCell className="text-center">Ramdani</TableCell>
                  <TableCell className="text-center"><Checkbox /></TableCell>
                  <TableCell className="text-center">
                    <div className="">
                      <DialogField
                      variant='outline'
                      name="Swapping"
                      title="Swapping"
                      size="sm">
                        <p>das</p>
                    </DialogField>
                    </div>
                  </TableCell>
              </TableRow>
            <TableRow>
                  <TableCell className="text-center">Ramdani</TableCell>
                  <TableCell className="text-center"><Checkbox /></TableCell>
                  <TableCell className="text-center">
                    <div className="">
                      <DialogField
                      variant='outline'
                      name="Swapping"
                      title="Swapping"
                      size="sm">
                        <p>das</p>
                    </DialogField>
                    </div>
                  </TableCell>
              </TableRow>
            <TableRow>
                  <TableCell className="text-center">Ramdani</TableCell>
                  <TableCell className="text-center"><Checkbox /></TableCell>
                  <TableCell className="text-center">
                    <div className="">
                      <DialogField
                      variant='outline'
                      name="Swapping"
                      title="Swapping"
                      size="sm">
                        <p>das</p>
                    </DialogField>
                    </div>
                  </TableCell>
              </TableRow>
          </TableBody>
        </Table>
        
      </div>
    )
  }

  export default PicketScheduleTable
