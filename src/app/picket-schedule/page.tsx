"use client";
import DatePicker from '@/components/custom-ui/DatePicker';
import DialogField from '@/components/custom-ui/DialogField';
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState, useEffect } from 'react'
import { MultiSelectDropdownField } from '@/components/custom-ui/MultiSelectDropdownField';
import { getAllUsers } from '@/services/users/userService';
import { postSchedulePicket, getAllSchedules2, deleteSchedulePicket } from '@/services/picket/picketService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import MotionWrapper from '@/components/custom-ui/MotionWrapper';


const Picket = () => {

  const [activePage, setActivePage] = useState<string>("picketschedule");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [futureSchedules, setFutureSchedules] = useState<{ _id: string, date: string, description: string }[]>([]);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayLabels: Record<string, string> = {
    Monday: 'Team Senin',
    Tuesday: 'Team Selasa',
    Wednesday: 'Team Rabu',
    Thursday: 'Team Kamis',
    Friday: 'Team Jumat',
  };
  const dayNumbers: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
  };
  const [assignedUsers, setAssignedUsers] = useState<Record<string, string[]>>({});
  const [dateDisabled, setDateDisabled] = useState(false);

  type User = { _id: string; name: string };
  useEffect(() => {
    async function fetchUsers() {
      try {
        const users: User[] = await getAllUsers();
        setUserNames(users.map((u: User) => u.name));
        const map: Record<string, string> = {};
        users.forEach((u: User) => { map[u.name] = u._id; });
        setUserMap(map);
      } catch {
        setUserNames([]);
        setUserMap({});
      }
    }
    fetchUsers();
  }, []);

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
    if (endDate && date && endDate < date) {
      setEndDate(null);
    }
  };
  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
  };

  type Schedule = { _id: string; date: string; description: string };
  useEffect(() => {
    async function fetchSchedules() {
      try {
        const all = await getAllSchedules2();
        const today = new Date();
        today.setHours(0,0,0,0);
        const filtered = (all || []).filter((item: Schedule) => {
          const d = new Date(item.date);
          d.setHours(0,0,0,0);
          return d >= today;
        });
        setFutureSchedules(filtered.map((item: Schedule) => ({
          _id: item._id,
          date: item.date,
          description: item.description
        })));
      } catch {}
    }
    fetchSchedules();
  }, []);

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <Card className='p-5'>
          <div className="flex justify-between flex-col gap-3 lg:flex-row lg:gap-0">
            <div>
              <p className='font-medium text-center text-secondary-foreground text-lg lg:text-left'>Picket Schedule Today</p>
              <p className='font-medium text-primary text-lg text-center lg:text-left'>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex gap-3 flex-col lg:flex-row lg:gap-2">
              <DialogField
                name="Add Picket Schedule"
                title='Add Picket Schedule'
                onSubmit={async (closeDialog?: () => void) => {
                  if (!startDate || !endDate) return toast.error('Fill in the date first.!');
                  const patterns = days
                    .map(day => ({
                      daysOfWeek: [dayNumbers[day]],
                      assignedUsers: assignedUsers[day] || [],
                      description: dayLabels[day],
                    }))
                    .filter(pattern => pattern.assignedUsers.length > 0);
                  const payload = {
                    type: 'picket',
                    startDate: new Date(startDate + 'T00:00:00Z').toISOString(),
                    endDate: new Date(endDate + 'T23:59:59Z').toISOString(),
                    patterns,
                  };
                  try {
                    await postSchedulePicket(payload);
                    setDateDisabled(true);
                    toast.success('Success to make a schedule!');
                    if (typeof closeDialog === 'function') closeDialog();
                  } catch {
                    toast.error('Failed to submit schedule!');
                  }
                }}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <p>Start Date</p>
                    <div className="col-span-2">
                      <DatePicker value={startDate} onChange={handleStartDateChange} disabled={dateDisabled} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <p>End Date</p>
                    <div className="col-span-2">
                      <DatePicker value={endDate} onChange={handleEndDateChange} minDate={startDate || undefined} disabled={!startDate || dateDisabled} />
                    </div>
                  </div>
                  <p className='font-semibold mt-10'>Schedules Picket</p>
                  {days.map(day => (
                    <div className="grid grid-cols-1 gap-1 lg:gap-0 lg:grid-cols-3" key={day}>
                      <p>{day}</p>
                      <div className="col-span-2">
                        <MultiSelectDropdownField
                          menu={userNames.filter(name => {
                            const selectedIdsOtherDays = Object.entries(assignedUsers)
                              .filter(([d]) => d !== day)
                              .flatMap(([, ids]) => ids);
                            const id = userMap[name];
                            const isSelectedInThisDay = (assignedUsers[day] || []).includes(id);
                            if (isSelectedInThisDay) return true;
                            return !selectedIdsOtherDays.includes(id);
                          })}
                          title='Select Member'
                          value={(assignedUsers[day] || []).map(id => {
                            // Find the name for this id
                            const name = Object.keys(userMap).find(key => userMap[key] === id);
                            return name || '';
                          }).filter(Boolean)}
                          onChange={(selectedNames: string[]) => {
                            setAssignedUsers(prev => ({
                              ...prev,
                              [day]: selectedNames.map(name => userMap[name]).filter(Boolean)
                            }));
                          }}
                        />
                      </div>
                    </div>
                  ))}

                </div>
              </DialogField>
              <DialogField title='Delete Picket Schedule' name='Delete Picket Schedule' variant='destructive'>
                <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-none">
                  {futureSchedules.length === 0 && 
                  <div className="">
                    <Image src='/icon/no-data.png' alt='No schedules' width={200} height={200} className='mx-auto mt-10' />
                    <p className="text-center text-muted-foreground mt">No future picket schedules.</p>
                  </div> 
                  }
                  {futureSchedules.map(sch => {
                    const dateObj = new Date(sch.date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                    const dateStr = dateObj.toISOString().slice(0, 10);
                    return (
                      <div className="grid grid-cols-2 items-center" key={sch._id}>
                        <p >{dayName} ({dateStr})</p>
                        <Button
                          variant='destructive'
                          onClick={async () => {
                            try {
                              await deleteSchedulePicket(sch._id);
                              setFutureSchedules(prev => prev.filter(s => s._id !== sch._id));
                              toast.success('Schedule deleted!');
                            } catch {
                              toast.error('Failed to delete schedule!');
                            }
                          }}
                        >Delete</Button>
                      </div>
                    );
                  })}
                </div>
              </DialogField>
            </div>
          </div>
          <div>
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
              showMenu={true}
            />
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
}

export default Picket
