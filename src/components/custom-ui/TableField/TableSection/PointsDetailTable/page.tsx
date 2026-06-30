'use client';
import { ReportTableProps } from '@/types/ReportTableProps';
import React, { useEffect, useState } from 'react'
import { pointsdetail } from '../../headerConfig';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getKPIDetail } from '@/services/kpi/kpiService';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface PointsDetailTableProps extends ReportTableProps {
  searchQuery?: string;
  fetchTrigger?: number;
  onEdit?: (item: unknown) => void;
}

type KPIDetailItem = {
  _id: string;
  kpi_item: string;
  point: number;
  label: string;
  max_activity: number;
};

const PointsDetailTable = ({
  activePage,
  searchQuery,
  fetchTrigger,
  onEdit,
}: PointsDetailTableProps) => {

  const headers = pointsdetail[activePage] ?? [];
  const searchParams = useSearchParams();
  const masterId = searchParams.get('id');
  const [detailItems, setDetailItems] = useState<KPIDetailItem[]>([]);

  useEffect(() => {
    if (!masterId) return;
    const fetchDetail = async () => {
      try {
        const data = await getKPIDetail(masterId);
        setDetailItems(Array.isArray(data) ? data : [data]);
      } catch {
        toast.error('Failed to fetch KPI detail');
      }
    };
    fetchDetail();
  }, [masterId, fetchTrigger]);

  const filteredData = searchQuery
    ? detailItems.filter((item) =>
        item.kpi_item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.point?.toString().includes(searchQuery.toLowerCase())
      )
    : detailItems;

  return (
    <div>
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {headers.map((header, i) => (
              <TableHead key={i} className='w-40 lg:w-full'>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, idx) => (
            <TableRow key={item._id || idx}>
              <TableCell className='text-center'>{item.kpi_item}</TableCell>
              <TableCell className='text-center'>{item.point}%</TableCell>
              <TableCell className='text-center'>{item.max_activity}</TableCell>
              <TableCell className='text-center'>{item.label}</TableCell>
              <TableCell className='flex justify-center'>
                {onEdit && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PointsDetailTable
