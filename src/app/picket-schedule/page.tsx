"use client";
import DatePicker from '@/components/custom-ui/DatePicker';
import DialogField from '@/components/custom-ui/DialogField';
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState, useEffect } from 'react'
import { MultiSelectDropdownField } from '@/components/custom-ui/MultiSelectDropdownField';
import { getAllUsers } from '@/services/users/userService';
import { postSchedulePicket } from '@/services/picket/picketService';
import { toast } from 'sonner';


const Picket = () => {

  const [activePage, setActivePage] = useState<string>("picketschedule");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({}); // name -> id
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

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await getAllUsers();
        setUserNames(users.map((u: any) => u.name));
        const map: Record<string, string> = {};
        users.forEach((u: any) => { map[u.name] = u._id; });
        setUserMap(map);
      } catch (e) {
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

  return (
    <ProtectedRoute>
      <Card className='p-5'>
        <div className="flex justify-between">
          <div>
            <p className='font-medium text-secondary-foreground text-lg'>Picket Schedule Today</p>
            <p className='font-medium text-primary text-lg'>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
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
              } catch (e) {
                toast.error('Failed to submit schedule!');
              }
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 items-center gap-2">
                <p>Start Date</p>
                <DatePicker value={startDate} onChange={handleStartDateChange} disabled={dateDisabled} />
              </div>
              <div className="grid grid-cols-2 items-center gap-2">
                <p>End Date</p>
                <DatePicker value={endDate} onChange={handleEndDateChange} minDate={startDate || undefined} disabled={!startDate || dateDisabled} />
              </div>
              <p className='font-semibold mt-10'>Schedules Picket</p>
              {days.map(day => (
                <div className="grid grid-cols-3" key={day}>
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
                        const entry = Object.entries(userMap).find(([name, _id]) => _id === id);
                        return entry ? entry[0] : '';
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
        </div>
        <div>
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={true}
          />
        </div>
      </Card>
    </ProtectedRoute>
  );
}

export default Picket
