  import { Menubar } from '@/components/custom-ui/MenuBar';
  import React, { useEffect, useState } from 'react';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
  import { Checkbox } from '@/components/ui/checkbox';
  import DialogField from '@/components/custom-ui/DialogField';
  import { picketschedule } from '../../headerConfig';
  import { getAllSchedules, getOperationalRecords, postOperationalRecord, deleteOperationalRecord, getRangeSchedules, swapPicketUsers } from '@/services/picket/picketService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ReportTableProps } from '@/types/ReportTableProps';
import InputField from '@/components/custom-ui/InputField';

const PicketScheduleTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  fetchTrigger
}: ReportTableProps) => {
  const picketHeaders = picketschedule[activePage] ?? [];
  type AssignedUser = {
    _id: string;
    name: string;
  };

  type Schedule = {
    _id: string;
    date: string | Date;
    assignedUsers: AssignedUser[];
  };

  type OperationalRecord = {
    _id: string;
    userId: string;
    scheduleId: string;
    type: string;
    date: string | Date;
  };

  const [picketData, setPicketData] = useState<AssignedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkedUsers, setCheckedUsers] = useState<{ [key: string]: boolean }>({});
  const [recordIds, setRecordIds] = useState<{ [key: string]: string }>({});
  const [scheduleId, setScheduleId] = useState<string>('');
  const [rangeSchedules, setRangeSchedules] = useState<Schedule[]>([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const data = await getAllSchedules({ year, month, day });
        const operationalRecords = await getOperationalRecords();
        const withUsers = data.filter((d: Schedule) => d.assignedUsers && d.assignedUsers.length > 0);
        const users = withUsers.length > 0 ? withUsers[0].assignedUsers : [];
        const scheduleIdValue = withUsers.length > 0 ? withUsers[0]._id : '';
        setScheduleId(scheduleIdValue);
        const getWeekNumber = (date: Date) => {
          const firstDay = new Date(date.getFullYear(), 0, 1);
          const days = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
          return Math.ceil((days + firstDay.getDay() + 1) / 7);
        };
        const week = getWeekNumber(today);
        const maxPicket = 6;
        const limitedUsers = users.slice(0, maxPicket);
        const rotated = limitedUsers.slice(week % limitedUsers.length).concat(limitedUsers.slice(0, week % limitedUsers.length));
        setPicketData(rotated);
        const checked: { [key: string]: boolean } = {};
        const ids: { [key: string]: string } = {};
        (operationalRecords as OperationalRecord[]).forEach((rec) => {
          if (rec.scheduleId === scheduleIdValue) {
            checked[rec.userId] = true;
            ids[rec.userId] = rec._id;
          }
        });
        setCheckedUsers(checked);
        setRecordIds(ids);

        const range = await getRangeSchedules({});
        setRangeSchedules(range);
      } catch {
        setPicketData([]);
        setCheckedUsers({});
        setRangeSchedules([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [fetchTrigger]);

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
              <TableHead key={i} className="w-40 lg:w-full">
                {header}
              </TableHead>
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
              <TableCell colSpan={picketHeaders.length} className="text-center">There is no picket data today</TableCell>
            </TableRow>
          ) : (
            picketData.map((user, idx) => (
              <TableRow key={user._id || idx}>
                <TableCell className="text-center">{user.name.split(' ')[0]}</TableCell>
                <TableCell className="text-center">
                    <Checkbox
                      checked={!!checkedUsers[user._id]}
                      onCheckedChange={async (checked) => {
                        if (checked && !checkedUsers[user._id]) {
                          const today = new Date();
                          const dateStr = today.toISOString();
                          await postOperationalRecord({
                            scheduleId,
                            userId: user._id,
                            type: 'picket',
                            date: dateStr,
                          });
                          const operationalRecords = await getOperationalRecords();
                          const checked: { [key: string]: boolean } = {};
                          const ids: { [key: string]: string } = {};
                          (operationalRecords as OperationalRecord[]).forEach((rec) => {
                            if (rec.scheduleId === scheduleId) {
                              checked[rec.userId] = true;
                              ids[rec.userId] = rec._id;
                            }
                          });
                          setCheckedUsers(checked);
                          setRecordIds(ids);
                        } else if (!checked && checkedUsers[user._id]) {
                          const recordId = recordIds[user._id];
                          if (recordId) {
                            await deleteOperationalRecord(recordId);
                            setCheckedUsers((prev) => {
                              const copy = { ...prev };
                              delete copy[user._id];
                              return copy;
                            });
                            setRecordIds((prev) => {
                              const copy = { ...prev };
                              delete copy[user._id];
                              return copy;
                            });
                          }
                        }
                      }}
                    />
                </TableCell>
                <TableCell>
                  <DialogField
                      variant='outline'
                      name="Swapping"
                      title="Swapping"
                      size="sm"
                    >
                      <InputField
                        type='text'
                        placeholder='Search by Name'
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                      />
                      <div className='flex flex-col gap-2 max-h-72  overflow-y-auto'>
                        {(() => {
                          const today = new Date();
                          const todayStr = today.toISOString().slice(0, 10);
                          const pairs: { schedule: Schedule, assigned: AssignedUser }[] = [];
                          rangeSchedules.forEach((schedule) => {
                            const scheduleDate = new Date(schedule.date);
                            const scheduleStr = scheduleDate.toISOString().slice(0, 10);
                            if (scheduleStr > todayStr && schedule.assignedUsers) {
                              schedule.assignedUsers.forEach((assigned) => {
                                if (assigned.name.toLowerCase().includes(searchName.toLowerCase())) {
                                  pairs.push({ schedule, assigned });
                                }
                              });
                            }
                          });
                          const uniquePairs = pairs.filter((pair, idx, arr) =>
                            arr.findIndex(p => p.schedule._id === pair.schedule._id && p.assigned._id === pair.assigned._id) === idx
                          );
                          return uniquePairs.map(({ schedule, assigned }, idx) => (
                            <div key={schedule._id + '-' + assigned._id + '-' + idx} className="grid grid-cols-3 border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                              <p>{assigned.name.split(' ')[0]}</p>
                              <p>{schedule.date ? new Date(schedule.date).toISOString().slice(0, 10) : ''}</p>
                              <Button
                                className='text-sm px-0 py-1'
                                onClick={async () => {
                                  try {
                                    await swapPicketUsers({
                                      schedule1Id: scheduleId,
                                      schedule1UserId: user._id,
                                      schedule2Id: schedule._id,
                                      schedule2UserId: assigned._id,
                                    });

                                    const operationalRecords = await getOperationalRecords();
                                    const targetRecord = (operationalRecords as OperationalRecord[]).find((rec) => rec.scheduleId === schedule._id && rec.userId === assigned._id);
                                    if (targetRecord) {
                                      await deleteOperationalRecord(targetRecord._id);
                                      setCheckedUsers((prev) => {
                                        const copy = { ...prev };
                                        delete copy[assigned._id];
                                        return copy;
                                      });
                                      setRecordIds((prev) => {
                                        const copy = { ...prev };
                                        delete copy[assigned._id];
                                        return copy;
                                      });
                                    }
                                    const userRecord = (operationalRecords as OperationalRecord[]).find((rec) => rec.scheduleId === scheduleId && rec.userId === user._id);
                                    if (userRecord) {
                                      await deleteOperationalRecord(userRecord._id);
                                      setCheckedUsers((prev) => {
                                        const copy = { ...prev };
                                        delete copy[user._id];
                                        return copy;
                                      });
                                      setRecordIds((prev) => {
                                        const copy = { ...prev };
                                        delete copy[user._id];
                                        return copy;
                                      });
                                    }

                                    const range = await getRangeSchedules({});
                                    setRangeSchedules(range);

                                    const today = new Date();
                                    const year = today.getFullYear();
                                    const month = String(today.getMonth() + 1).padStart(2, '0');
                                    const day = String(today.getDate()).padStart(2, '0');
                                    const data = await getAllSchedules({ year, month, day });
                                    const withUsers = data.filter((d: Schedule) => d.assignedUsers && d.assignedUsers.length > 0);
                                    const users = withUsers.length > 0 ? withUsers[0].assignedUsers : [];
                                    const getWeekNumber = (date: Date) => {
                                      const firstDay = new Date(date.getFullYear(), 0, 1);
                                      const days = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
                                      return Math.ceil((days + firstDay.getDay() + 1) / 7);
                                    };
                                    const week = getWeekNumber(today);
                                    const maxPicket = 6;
                                    const limitedUsers = users.slice(0, maxPicket);
                                    const rotated = limitedUsers.slice(week % limitedUsers.length).concat(limitedUsers.slice(0, week % limitedUsers.length));
                                    setPicketData(rotated);
                                    toast.success('Berhasil mengganti piket!');
                                  } catch (err) {
                                    console.error('Swap failed', err);
                                    toast.error('Gagal mengganti piket!');
                                  }
                                }}
                              >
                                Swapping
                              </Button>
                            </div>
                          ));
                        })()}
                      </div>
                    </DialogField>
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
