import { ReportTableProps } from '@/types/ReportTableProps';
import React, { useEffect, useState } from 'react'
import { points } from '../../headerConfig';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KPIItem, updateKPIItem } from '@/services/points/pointsService';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { ChangeEvent } from 'react';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { toast } from 'sonner';

interface ProductsTableProps extends ReportTableProps {
  searchQuery?: string;
   fetchTrigger?: number;
}

const PointsTable = ({
  activePage,
  searchQuery,
  fetchTrigger
}: ProductsTableProps) => {

  const pointsHeaders = points[activePage] ?? [];
  type KPIItem = {
    _id: string;
    category: string;
    code: string;
    point: number;
  };
  const [kpiItems, setKpiItems] = useState<KPIItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editPoint, setEditPoint] = useState<string>('');
  const fetchKPI = async () => {
    try {
      const data = await KPIItem();
      setKpiItems(data);
    } catch {
      toast.error('Failed to fetch KPI items');
    }
  };


  useEffect(() => {
    fetchKPI();
  }, [fetchTrigger]);

  const filteredData = searchQuery
    ? kpiItems.filter((item) =>
        item.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.point?.toString().includes(searchQuery.toLowerCase())
      )
    : kpiItems;


  const handleEditClick = (item: KPIItem) => {
    setEditId(item._id);
    setEditCategory(item.category);
    setEditCode(item.code);
    setEditPoint(item.point !== undefined && item.point !== null ? String(item.point) : '');
  };

  const handleEditSave = async () => {
    if (!editId) return;
    try {
      await updateKPIItem(editId, {
        category: editCategory,
        code: editCode,
        point: Number(editPoint),
      });
      toast.success('KPI item updated');
      setEditId(null);
      fetchKPI();
    } catch {
      toast.error('Failed to update KPI item');
    }
  };

  return (
    <div>
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {pointsHeaders.map((header, i) => (
              <TableHead key={i} className='w-40 lg:w-full'>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, idx) => (
            <TableRow key={item._id || idx}>
              <TableCell className='text-center'>{item.category}</TableCell>
              <TableCell className='text-center'>{item.code}</TableCell>
              <TableCell className='text-center'>{item.point}</TableCell>
              <TableCell className='flex justify-center'>
                <DialogField
                  title={`Edit Points ${item.code}`}
                  name="Edit"
                  variant='outline'
                  noPadding
                  open={editId === item._id}
                  onOpenChange={(open: boolean) => {
                    if (open) handleEditClick(item);
                    else setEditId(null);
                  }}
                  onSubmit={async (closeDialog?: () => void) => {
                    await handleEditSave();
                    if (closeDialog) closeDialog();
                  }}
                >
                  <form className="flex flex-col gap-2 p-4" onSubmit={e => e.preventDefault()}>
                    <DropdownField
                      label="Category"
                      menu={["OPERATIONAL", "RESEARCH", "BRANDING", "COMPETITION"]}
                      value={editCategory}
                      onChange={setEditCategory}
                    />
                    <InputField
                      type="string"
                      placeholder="Ex: PICKET"
                      label="Code"
                      value={editCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEditCode(e.target.value)}
                    />
                    <InputField
                      type="number"
                      placeholder="Ex: 5"
                      label="Point"
                      value={editPoint}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEditPoint(e.target.value)}
                    />
                  </form>
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
