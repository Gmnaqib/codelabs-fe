  import { Menubar } from '@/components/custom-ui/MenuBar';
  import React, { useEffect, useState } from 'react';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
  import { Checkbox } from '@/components/ui/checkbox';
  import DialogField from '@/components/custom-ui/DialogField';
  import { picketschedule } from '../../headerConfig';
  import { getAllSchedules } from '@/services/picket/picketService';

const PicketScheduleTable = ({
  activePage,
  onPageChange,
  showMenu = true,
}: ReportTableProps) => {
  const picketHeaders = picketschedule[activePage] ?? [];
  const [picketData, setPicketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const data = await getAllSchedules({ year, month, day });
        console.log('Schedules data:', data);
        const withUsers = data.filter((d: any) => d.assignedUsers && d.assignedUsers.length > 0);
        const users = withUsers.length > 0 ? withUsers[0].assignedUsers : [];
        setPicketData(users);
      } catch (e) {
        setPicketData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div>
      {showMenu && (
        <Menubar
          menus={Object.keys(picketschedule)}
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={picketHeaders.length} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : picketData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={picketHeaders.length} className="text-center">Tidak ada data piket hari ini</TableCell>
            </TableRow>
          ) : (
            picketData.map((user: any, idx: number) => (
              <TableRow key={user._id || idx}>
                <TableCell className="text-center">{user.name.split(' ')[0]}</TableCell>
                <TableCell className="text-center"><Checkbox /></TableCell>
                <TableCell className="text-center">
                  <div>
                    <DialogField
                      variant='outline'
                      name="Swapping"
                      title="Swapping"
                      size="sm"
                    >
                      <p>Swap</p>
                    </DialogField>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PicketScheduleTable;
