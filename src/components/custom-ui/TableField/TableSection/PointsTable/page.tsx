'use client';
import { ReportTableProps } from '@/types/ReportTableProps';
import React, { useEffect, useState } from 'react'
import { points } from '../../headerConfig';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getKPIMaster, getKPIDetail } from '@/services/kpi/kpiService';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductsTableProps extends ReportTableProps {
  searchQuery?: string;
  fetchTrigger?: number;
  onEdit?: (item: unknown) => void;
}

type KPIDetailItem = { point: number; label: string };

type KPIMasterItem = {
  _id: string;
  kementerian: string;
  point: number;
  utilized?: number;
};

const PointsTable = ({
  activePage,
  searchQuery,
  fetchTrigger,
  onEdit,
}: ProductsTableProps) => {

  const pointsHeaders = points[activePage] ?? [];
  const [kpiItems, setKpiItems] = useState<KPIMasterItem[]>([]);
  const router = useRouter();

  const fetchKPI = async () => {
    try {
      const data: KPIMasterItem[] = await getKPIMaster();
      const withUtilized = await Promise.all(
        data.map(async (item) => {
          try {
            const details: KPIDetailItem[] = await getKPIDetail(item._id);
            const utilized = (Array.isArray(details) ? details : [])
              .filter((d) => d.label === 'REQUIRED')
              .reduce((sum, d) => sum + d.point, 0);
            return { ...item, utilized };
          } catch {
            return { ...item, utilized: 0 };
          }
        })
      );
      setKpiItems(withUtilized);
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
          {filteredData.map((item, idx) => {
            const utilized = item.utilized ?? 0;
            const isFull = utilized >= item.point;
            return (
              <TableRow key={item._id || idx}>
                <TableCell className='text-center'>{item.kementerian}</TableCell>
                <TableCell className='text-center'>{item.point}%</TableCell>
                <TableCell className='text-center'>
                  <span className={isFull ? 'text-green-600 font-medium' : 'text-amber-500 font-medium'}>
                    {utilized}%
                  </span>
                  <span className='text-gray-400 text-xs ml-1'>/ {item.point}%</span>
                </TableCell>
                <TableCell className='flex justify-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => router.push(`/points/details?id=${item._id}`)}
                  >
                    Detail
                  </Button>
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default PointsTable
