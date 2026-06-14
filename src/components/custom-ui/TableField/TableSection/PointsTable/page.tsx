import { ReportTableProps } from '@/types/ReportTableProps';
import React, { useEffect, useState } from 'react'
import { points } from '../../headerConfig';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getKPIMaster } from '@/services/kpi/kpiService';
import DialogField from '@/components/custom-ui/DialogField';
import { toast } from 'sonner';

interface ProductsTableProps extends ReportTableProps {
  searchQuery?: string;
  fetchTrigger?: number;
}

type KPIMasterItem = {
  _id: string;
  kementerian: string;
  point: number;
};

const PointsTable = ({
  activePage,
  searchQuery,
  fetchTrigger
}: ProductsTableProps) => {

  const pointsHeaders = points[activePage] ?? [];
  const [kpiItems, setKpiItems] = useState<KPIMasterItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchKPI = async () => {
    try {
      const data = await getKPIMaster();
      setKpiItems(data);
    } catch {
      toast.error('Failed to fetch KPI master');
    }
  };

  useEffect(() => {
    fetchKPI();
  }, [fetchTrigger]);

  const filteredData = searchQuery
    ? kpiItems.filter((item) =>
        item.kementerian?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.point?.toString().includes(searchQuery.toLowerCase())
      )
    : kpiItems;

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
              <TableCell className='text-center'>{item.kementerian}</TableCell>
              <TableCell className='text-center'>{item.point}</TableCell>
              <TableCell className='flex justify-center'>
                <DialogField
                  title={`Detail Points ${item.kementerian}`}
                  name="Detail"
                  variant='outline'
                  noPadding
                  open={editId === item._id}
                  onOpenChange={(open: boolean) => {
                    if (open) setEditId(item._id);
                    else setEditId(null);
                  }}
                  onSubmit={async (closeDialog?: () => void) => {
                    if (closeDialog) closeDialog();
                  }}
                >
                  <div className="p-4">
                    {/* edit form coming soon */}
                  </div>
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
