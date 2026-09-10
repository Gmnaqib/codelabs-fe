"use client";
import DatePicker from '@/components/custom-ui/DatePicker';
import DialogField from '@/components/custom-ui/DialogField';
import { Menubar } from '@/components/custom-ui/MenuBar';
import PicketScheduleTable from '@/features/picket/components/PicketScheduleTable'
import ThematicScheduleTable from '@/features/thematic/components/ThematicScheduleTable'
import ThematicSwapCell from '@/features/thematic/components/ThematicSwapCell'
import { useThematicScheduleTable } from '@/features/thematic/hooks/useThematicScheduleTable'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useState, useEffect } from 'react'
import { MultiSelectDropdownField } from '@/components/custom-ui/MultiSelectDropdownField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { THEMATIC_CATEGORIES } from '@/features/thematic/config/categories';
import { getAllUsers } from '@/services/users/userService';
import { postSchedulePicket, getAllSchedules2, deleteSchedulePicket } from '@/services/picket/picketService';
import { postScheduleThematicBatch, getAllSchedulesThematic, deleteScheduleThematic } from '@/services/thematic/thematicService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/custom-ui/EmptyState';
import { TagIcon } from '@heroicons/react/24/solid';
import MotionWrapper from '@/components/custom-ui/MotionWrapper';

type ScheduleTab = 'Picket' | 'Thematic';
const SCHEDULE_MENUS: ScheduleTab[] = ['Picket', 'Thematic'];

const todayIso = () => new Date().toISOString().slice(0, 10);

const Schedule = () => {
  const [activeTab, setActiveTab] = useState<ScheduleTab>('Picket');
  const [viewDate, setViewDate] = useState<string>(todayIso);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [futureSchedules, setFutureSchedules] = useState<{ _id: string, date: string, description: string }[]>([]);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [maxNames, setMaxNames] = useState(5);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [assignedUsers, setAssignedUsers] = useState<Record<string, string[]>>({});
  const [dateDisabled, setDateDisabled] = useState(false);

  // Lifted up (rather than owned inside ThematicScheduleTable) so the "Swap
  // Team" action can live in the page's button row, as one action for the
  // whole day's team instead of a button per person in the table.
  const {
    thematicData,
    loading: thematicLoading,
    category: thematicCategory,
    rangeSchedules: thematicRangeSchedules,
    handleSwap: handleThematicSwap,
  } = useThematicScheduleTable({ fetchTrigger, date: viewDate, enabled: activeTab === 'Thematic' });

  // Thematic doesn't repeat weekly like picket — each entry is one specific
  // date with its own team and category.
  type ThematicEntry = { date: string | null; assignedUsers: string[]; category: string | null };
  const [thematicEntries, setThematicEntries] = useState<ThematicEntry[]>([{ date: null, assignedUsers: [], category: null }]);

  const addThematicEntry = () => {
    setThematicEntries(prev => [...prev, { date: null, assignedUsers: [], category: null }]);
  };
  const removeThematicEntry = (idx: number) => {
    setThematicEntries(prev => prev.filter((_, i) => i !== idx));
  };
  const updateThematicEntryDate = (idx: number, date: string | null) => {
    setThematicEntries(prev => prev.map((e, i) => (i === idx ? { ...e, date } : e)));
  };
  const updateThematicEntryUsers = (idx: number, userIds: string[]) => {
    setThematicEntries(prev => prev.map((e, i) => (i === idx ? { ...e, assignedUsers: userIds } : e)));
  };
  const updateThematicEntryCategory = (idx: number, category: string) => {
    setThematicEntries(prev => prev.map((e, i) => (i === idx ? { ...e, category } : e)));
  };

  // Picket and Thematic are separate schedule types, so the "add schedule"
  // form starts fresh whenever the tab changes.
  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
    setAssignedUsers({});
    setDateDisabled(false);
    setThematicEntries([{ date: null, assignedUsers: [], category: null }]);
  }, [activeTab]);

  useEffect(() => {
    function updateMaxNames() {
      if (window.matchMedia('(max-width: 640px)').matches) {
        setMaxNames(3);
      } else if (window.matchMedia('(max-width: 1024px)').matches) {
        setMaxNames(5);
      } else {
        setMaxNames(5);
      }
    }
    updateMaxNames();
    window.addEventListener('resize', updateMaxNames);
    return () => window.removeEventListener('resize', updateMaxNames);
  }, []);

  const dayLabels: Record<string, string> = {
    Monday: 'Team Monday',
    Tuesday: 'Team Tuesday',
    Wednesday: 'Team Wednesday',
    Thursday: 'Team Thursday',
    Friday: 'Team Friday',
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

  type User = { _id: string; name: string };
  useEffect(() => {
    async function fetchUsers() {
      try {
        const users: User[] = await getAllUsers({ activeOnly: true });
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
        const all = activeTab === 'Picket' ? await getAllSchedules2() : await getAllSchedulesThematic();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filtered = (all || []).filter((item: Schedule) => {
          const d = new Date(item.date);
          d.setHours(0, 0, 0, 0);
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
  }, [activeTab, fetchTrigger]);

  return (
    <ProtectedRoute roles={['admin', 'minister of operation']}>
      <MotionWrapper>
        <Card className='p-5'>
          <Menubar
            menus={SCHEDULE_MENUS}
            activeMenu={activeTab}
            onChange={(menu) => setActiveTab(menu as ScheduleTab)}
            filter
            search={false}
            dateFilterMode="day"
            dayFilterProps={{
              value: viewDate,
              onChange: (d) => d && setViewDate(d),
              minDate: todayIso(),
            }}
          />
          <div className="flex justify-between items-center gap-3 flex-col lg:flex-row lg:gap-2">
            <div>
              {activeTab === 'Thematic' && thematicCategory && (
                <span className="inline-flex h-9 items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 text-sm font-semibold text-primary">
                  <TagIcon className="size-4" />
                  {thematicCategory}
                </span>
              )}
            </div>
            <div className="flex gap-3 flex-col lg:flex-row lg:gap-2">
              {activeTab === 'Thematic' && thematicData.length > 0 && (
                <ThematicSwapCell rangeSchedules={thematicRangeSchedules} onSwap={handleThematicSwap} />
              )}
              <DialogField
                name="Add Schedule"
                title={`Add ${activeTab} Schedule`}
                onSubmit={async (closeDialog?: () => void) => {
                  if (activeTab === 'Picket') {
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
                      setFetchTrigger(Date.now());
                      if (typeof closeDialog === 'function') closeDialog();
                    } catch {
                      toast.error('Failed to submit schedule!');
                    }
                    return;
                  }

                  // Thematic: each entry needs its own date + team + category, no day-of-week pattern.
                  const validEntries = thematicEntries.filter(e => e.date && e.assignedUsers.length > 0 && e.category);
                  if (validEntries.length === 0) return toast.error('Fill in at least one date, team, and category first.!');
                  try {
                    await postScheduleThematicBatch(
                      validEntries.map(e => ({
                        date: e.date as string,
                        assignedUsers: e.assignedUsers,
                        description: e.category as string,
                      }))
                    );
                    toast.success('Success to make a schedule!');
                    setFetchTrigger(Date.now());
                    setThematicEntries([{ date: null, assignedUsers: [], category: null }]);
                    if (typeof closeDialog === 'function') closeDialog();
                  } catch {
                    toast.error('Failed to submit schedule!');
                  }
                }}
              >
                {activeTab === 'Picket' ? (
                  <div className="space-y-6">
                    <div className="rounded-xl border bg-secondary/30 p-4">
                      <p className="mb-3 text-sm font-semibold text-secondary-foreground">Schedule Period</p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 items-center gap-2">
                          <p className="text-sm">Start Date</p>
                          <div className="col-span-2">
                            <DatePicker value={startDate} onChange={handleStartDateChange} disabled={dateDisabled} />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-2">
                          <p className="text-sm">End Date</p>
                          <div className="col-span-2">
                            <DatePicker value={endDate} onChange={handleEndDateChange} minDate={startDate || undefined} disabled={!startDate || dateDisabled} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 font-semibold">Schedules Picket</p>
                      <div className="space-y-2">
                        {days.map(day => (
                          <div className="flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:gap-4" key={day}>
                            <p className="shrink-0 text-sm font-medium sm:w-28">{day}</p>
                            <div className="min-w-0 flex-1">
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
                                  const name = Object.keys(userMap).find(key => userMap[key] === id);
                                  return name || '';
                                }).filter(Boolean)}
                                displayValue={(() => {
                                  const names = (assignedUsers[day] || []).map(id => {
                                    const name = Object.keys(userMap).find(key => userMap[key] === id);
                                    return name || '';
                                  }).filter(Boolean);
                                  if (names.length > maxNames) {
                                    return [...names.slice(0, maxNames), '...'];
                                  }
                                  return names;
                                })()}
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
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {thematicEntries.map((entry, idx) => {
                      const otherDates = thematicEntries
                        .filter((_, i) => i !== idx)
                        .map(e => e.date)
                        .filter((d): d is string => !!d);
                      const selectedNames = entry.assignedUsers
                        .map(id => Object.keys(userMap).find(key => userMap[key] === id))
                        .filter((n): n is string => !!n);
                      return (
                        <div key={idx} className="space-y-3 rounded-xl border px-4 py-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Date {idx + 1}</p>
                            {thematicEntries.length > 1 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeThematicEntry(idx)}>
                                Remove
                              </Button>
                            )}
                          </div>
                          <DatePicker
                            value={entry.date}
                            onChange={(d) => updateThematicEntryDate(idx, d)}
                            minDate={todayIso()}
                            disabledDaysOfWeek={[0]}
                            disabledDates={otherDates}
                          />
                          <DropdownField
                            label="Category"
                            title="Select Category"
                            menu={THEMATIC_CATEGORIES}
                            value={entry.category || undefined}
                            onSelect={(value) => updateThematicEntryCategory(idx, value)}
                          />
                          <MultiSelectDropdownField
                            menu={userNames}
                            title='Select Member'
                            value={selectedNames}
                            displayValue={
                              selectedNames.length > maxNames
                                ? [...selectedNames.slice(0, maxNames), '...']
                                : selectedNames
                            }
                            onChange={(selectedName: string[]) => {
                              updateThematicEntryUsers(idx, selectedName.map(name => userMap[name]).filter(Boolean));
                            }}
                          />
                        </div>
                      );
                    })}
                    <Button type="button" variant="outline" size="sm" onClick={addThematicEntry}>
                      + Add Another Date
                    </Button>
                  </div>
                )}
              </DialogField>
              <DialogField title={`Delete ${activeTab} Schedule`} name="Delete Schedule" variant='destructive'>
                <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-none">
                  {futureSchedules.length === 0 && (
                    <EmptyState message={`No future ${activeTab.toLowerCase()} schedules.`} className="py-8" />
                  )}
                  {futureSchedules.map(sch => {
                    const dateObj = new Date(sch.date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                    const dateStr = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                    return (
                      <div
                        key={sch._id}
                        className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-destructive/40 hover:bg-destructive/5"
                      >
                        <div>
                          <p className="text-sm font-medium">{dayName}</p>
                          <p className="text-xs text-muted-foreground">{dateStr}</p>
                          {activeTab === 'Thematic' && sch.description && (
                            <p className="text-xs text-primary">{sch.description}</p>
                          )}
                        </div>
                        <Button
                          variant='destructive'
                          size='sm'
                          className="shrink-0"
                          onClick={async () => {
                            try {
                              if (activeTab === 'Picket') {
                                await deleteSchedulePicket(sch._id);
                              } else {
                                await deleteScheduleThematic(sch._id);
                              }
                              setFutureSchedules(prev => prev.filter(s => s._id !== sch._id));
                              toast.success('Schedule deleted!');
                              setFetchTrigger(Date.now());
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
            {activeTab === 'Picket' ? (
              <PicketScheduleTable fetchTrigger={fetchTrigger} date={viewDate} />
            ) : (
              <ThematicScheduleTable data={thematicData} loading={thematicLoading} />
            )}
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
}

export default Schedule
