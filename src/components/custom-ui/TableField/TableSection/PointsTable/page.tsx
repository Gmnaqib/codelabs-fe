import { ReportTableProps } from '@/types/ReportTableProps';
import React, { useEffect, useState } from 'react'
import { points, products } from '../../headerConfig';
import { Menubar } from '@/components/custom-ui/MenuBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getProducts, editProduct } from '@/services/product/productsService';
import { KPIItem } from '@/services/points/pointsService';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { ChangeEvent } from 'react';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { toast } from 'sonner';

const PointsTable = ({
  activePage,
}: ReportTableProps) => {

  const pointsHeaders = points[activePage] ?? [];
  const [kpiItems, setKpiItems] = useState<any[]>([]);
  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const data = await KPIItem();
        setKpiItems(data);
      } catch (err) {
        toast.error('Failed to fetch KPI items');
      }
    };
    fetchKPI();
  }, []);

  return (
    <div>
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {pointsHeaders.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {kpiItems.map((item, idx) => (
            <TableRow key={item._id || idx}>
              <TableCell className='text-center'>{item.category}</TableCell>
              <TableCell className='text-center'>{item.code}</TableCell>
              <TableCell className='text-center'>{item.point}</TableCell>
              <TableCell className='flex justify-center'>
                <DialogField title={`edit-points-${item.code}`} name="Edit" variant='outline' noPadding>
                    tes
                </DialogField>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PointsTable
