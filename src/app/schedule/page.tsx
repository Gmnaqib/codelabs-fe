"use client";
import DatePicker from '@/components/custom-ui/DatePicker';
import DateRangePicker from '@/components/custom-ui/DateRangePicker';
import DialogField from '@/components/custom-ui/DialogField';
import { Menubar } from '@/components/custom-ui/MenuBar';
import PicketScheduleTable from '@/features/picket/components/PicketScheduleTable'
import MonthlyThematicScheduleList from '@/features/thematic/components/MonthlyThematicScheduleList'
import { useMonthlyThematicSchedule } from '@/features/thematic/hooks/useMonthlyThematicSchedule'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useState, useEffect, useMemo } from 'react'
import { MultiSelectDropdownField } from '@/components/custom-ui/MultiSelectDropdownField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { THEMATIC_CATEGORIES } from '@/features/thematic/config/categories';
import { getAllUsers } from '@/services/users/userService';
import { postSchedulePicket, getUpcomingPicketSchedules, deleteSchedulePicket } from '@/services/picket/picketService';
import { downloadPicketScheduleTemplate, parsePicketScheduleExcel } from '@/features/picket/utils/picketScheduleExcel';
import { postScheduleThematicBatch, getUpcomingThematicSchedules, deleteScheduleThematic } from '@/services/thematic/thematicService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/custom-ui/EmptyState';
import MotionWrapper from '@/components/custom-ui/MotionWrapper';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

type ScheduleTab = 'Picket' | 'Thematic';
const SCHEDULE_MENUS: ScheduleTab[] = ['Picket', 'Thematic'];

const todayIso = () => new Date().toISOString().slice(0, 10);

// Matches how dates are formatted elsewhere on this page (the schedule list
// rows below) — avoids showing a raw ISO string like "2026-09-25". Parses
// the y/m/d parts directly (rather than `new Date(isoDate)`) so the
// displayed date can't shift a day depending on the browser's timezone.
const formatFriendlyDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

const Schedule = () => {
  const [activeTab, setActiveTab] = useState<ScheduleTab>('Picket');
  const [viewDate, setViewDate] = useState<string>(todayIso);
  const now = new Date();
  const [viewYear, setViewYear] = useState<number>(now.getFullYear());
  // 0-indexed, matching CalendarMonthYearPicker's onChange contract.
  const [viewMonth, setViewMonth] = useState<number>(now.getMonth());
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  type User = { _id: string; name: string; nim: string };
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [futureSchedules, setFutureSchedules] = useState<{ _id: string, date: string, description: string }[]>([]);
  const [deleteRangeStart, setDeleteRangeStart] = useState<string | null>(null);
  const [deleteRangeEnd, setDeleteRangeEnd] = useState<string | null>(null);
  const [showDeleteRangeModal, setShowDeleteRangeModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [maxNames, setMaxNames] = useState(5);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [assignedUsers, setAssignedUsers] = useState<Record<string, string[]>>({});
  const [dateDisabled, setDateDisabled] = useState(false);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  const [pickedFileName, setPickedFileName] = useState<string | null>(null);
  const [unmatchedNames, setUnmatchedNames] = useState<string[]>([]);
  const [ambiguousNames, setAmbiguousNames] = useState<string[]>([]);
  const [duplicateDayNames, setDuplicateDayNames] = useState<string[]>([]);

  // Dropdown options identify members by ID, not name — a name alone isn't
  // unique, so two members sharing a name get a NIM suffix to tell them apart.
  const userOptions = useMemo(() => {
    const nameCounts: Record<string, number> = {};
    allUsers.forEach((u) => {
      const key = u.name.trim().toLowerCase();
      nameCounts[key] = (nameCounts[key] ?? 0) + 1;
    });
    return allUsers.map((u) => ({
      value: u._id,
      label: (nameCounts[u.name.trim().toLowerCase()] ?? 0) > 1 ? `${u.name} (${u.nim})` : u.name,
    }));
  }, [allUsers]);

  const getUserLabel = (id: string): string | undefined =>
    userOptions.find((option) => option.value === id)?.label;

  // Case-insensitive name -> matching user IDs, for the Excel import (which
  // only has free-typed names to go on). More than one ID for a normalized
  // name means two active members share that name — resolving it
  // automatically there would silently pick the wrong person.
  const nameLookup = useMemo(() => {
    const lookup: Record<string, string[]> = {};
    allUsers.forEach((u) => {
      const key = u.name.trim().toLowerCase();
      (lookup[key] ??= []).push(u._id);
    });
    return lookup;
  }, [allUsers]);

  const {
    schedules: thematicSchedules,
    loading: thematicLoading,
    handleSwap: handleThematicSwap,
  } = useMonthlyThematicSchedule({
    year: viewYear,
    month: viewMonth + 1,
    fetchTrigger,
    enabled: activeTab === 'Thematic',
  });

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
    setIsSubmittingSchedule(false);
    setPickedFileName(null);
    setUnmatchedNames([]);
    setAmbiguousNames([]);
    setDuplicateDayNames([]);
    setDeleteRangeStart(null);
    setDeleteRangeEnd(null);
    setShowDeleteRangeModal(false);
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

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users: User[] = await getAllUsers({ activeOnly: true });
        setAllUsers(users);
      } catch {
        setAllUsers([]);
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

  const processPicketFile = async (file: File) => {
    try {
      const parsed = await parsePicketScheduleExcel(file);
      const resolved: Record<string, string[]> = {};
      const unmatched: string[] = [];
      const ambiguous: string[] = [];

      for (const day of Object.keys(parsed)) {
        const ids: string[] = [];
        for (const name of parsed[day]) {
          const matches = nameLookup[name.trim().toLowerCase()] ?? [];
          if (matches.length === 1) {
            ids.push(matches[0]);
          } else if (matches.length > 1) {
            ambiguous.push(`${name} (${day})`);
          } else {
            unmatched.push(`${name} (${day})`);
          }
        }
        resolved[day] = ids;
      }

      // Assigning the same person to more than one weekday is treated as a
      // mistake (most likely a copy-paste slip) — we can't tell which day was
      // intended, so exclude them from all of the affected days rather than
      // guessing.
      const daysByUserId: Record<string, string[]> = {};
      for (const day of Object.keys(resolved)) {
        for (const id of resolved[day]) {
          (daysByUserId[id] ??= []).push(day);
        }
      }
      const duplicateIds = new Set(
        Object.entries(daysByUserId)
          .filter(([, userDays]) => userDays.length > 1)
          .map(([id]) => id)
      );
      const duplicateAcrossDays = Object.entries(daysByUserId)
        .filter(([id]) => duplicateIds.has(id))
        .map(([id, userDays]) => `${getUserLabel(id) ?? id} (${userDays.join(' & ')})`);

      if (duplicateIds.size > 0) {
        for (const day of Object.keys(resolved)) {
          resolved[day] = resolved[day].filter((id) => !duplicateIds.has(id));
        }
      }

      setAssignedUsers(resolved);
      setUnmatchedNames(unmatched);
      setAmbiguousNames(ambiguous);
      setDuplicateDayNames(duplicateAcrossDays);
      setPickedFileName(file.name);

      if (unmatched.length > 0 || ambiguous.length > 0 || duplicateIds.size > 0) {
        const parts: string[] = [];
        if (unmatched.length > 0) parts.push(`${unmatched.length} not found`);
        if (ambiguous.length > 0) parts.push(`${ambiguous.length} ambiguous (duplicate name)`);
        if (duplicateIds.size > 0) parts.push(`${duplicateIds.size} assigned to multiple days`);
        toast.error(`${parts.join(', ')} — skipped.`);
      } else {
        toast.success('Schedule file loaded successfully!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to read the file.');
    }
  };

  const handlePicketFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    await processPicketFile(file);
  };

  const handlePicketFileDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processPicketFile(file);
  };

  type Schedule = { _id: string; date: string; description: string };
  useEffect(() => {
    async function fetchSchedules() {
      try {
        const all = activeTab === 'Picket' ? await getUpcomingPicketSchedules() : await getUpcomingThematicSchedules();
        setFutureSchedules((all || []).map((item: Schedule) => ({
          _id: item._id,
          date: item.date,
          description: item.description
        })));
        setDeleteRangeStart(null);
        setDeleteRangeEnd(null);
      } catch {}
    }
    fetchSchedules();
  }, [activeTab, fetchTrigger]);

  const schedulesInDeleteRange = deleteRangeStart && deleteRangeEnd
    ? futureSchedules.filter((sch) => {
        const d = sch.date.slice(0, 10);
        return d >= deleteRangeStart && d <= deleteRangeEnd;
      })
    : [];
  const deleteRangeIds = new Set(schedulesInDeleteRange.map((s) => s._id));

  const handleBulkDeleteRange = async () => {
    if (schedulesInDeleteRange.length === 0) return;
    setIsBulkDeleting(true);
    const ids = schedulesInDeleteRange.map((s) => s._id);
    const results = await Promise.allSettled(
      ids.map(id => (activeTab === 'Picket' ? deleteSchedulePicket(id) : deleteScheduleThematic(id)))
    );
    const succeededIds = ids.filter((_, i) => results[i].status === 'fulfilled');
    const failedCount = ids.length - succeededIds.length;

    setFutureSchedules(prev => prev.filter(s => !succeededIds.includes(s._id)));
    setDeleteRangeStart(null);
    setDeleteRangeEnd(null);
    setFetchTrigger(Date.now());
    setIsBulkDeleting(false);

    if (failedCount > 0) {
      toast.error(`${succeededIds.length} deleted, ${failedCount} failed.`);
    } else {
      toast.success(`${succeededIds.length} schedule(s) deleted!`);
    }
  };

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
            dateFilterMode={activeTab === 'Picket' ? 'day' : 'month'}
            dayFilterProps={{
              value: viewDate,
              onChange: (d) => d && setViewDate(d),
              minDate: todayIso(),
            }}
            filterProps={{
              onChange: (val) => {
                setViewYear(val.year);
                setViewMonth(val.month);
              },
              defaultYear: viewYear,
              defaultMonth: viewMonth,
            }}
          />
          <div className="flex justify-end items-center gap-3 flex-col lg:flex-row lg:gap-2">
            <div className="flex gap-3 flex-col lg:flex-row lg:gap-2">
              {activeTab === 'Picket' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => downloadPicketScheduleTemplate().catch(() => toast.error('Failed to generate the template.'))}
                >
                  Template
                </Button>
              )}
              <DialogField
                name="Add Schedule"
                title={`Add ${activeTab} Schedule`}
                submitDisabled={isSubmittingSchedule}
                onSubmit={async (closeDialog?: () => void) => {
                  // Guards against a double-click firing this twice while the
                  // first submit is still in flight — submitDisabled covers
                  // the button visually, this covers the race itself.
                  if (isSubmittingSchedule) return;

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
                    setIsSubmittingSchedule(true);
                    try {
                      await postSchedulePicket(payload);
                      setDateDisabled(true);
                      toast.success('Success to make a schedule!');
                      setFetchTrigger(Date.now());
                      if (typeof closeDialog === 'function') closeDialog();
                    } catch {
                      toast.error('Failed to submit schedule!');
                    } finally {
                      setIsSubmittingSchedule(false);
                    }
                    return;
                  }

                  // Thematic: each entry needs its own date + team + category, no day-of-week pattern.
                  const validEntries = thematicEntries.filter(e => e.date && e.assignedUsers.length > 0 && e.category);
                  if (validEntries.length === 0) return toast.error('Fill in at least one date, team, and category first.!');
                  setIsSubmittingSchedule(true);
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
                  } finally {
                    setIsSubmittingSchedule(false);
                  }
                }}
              >
                {activeTab === 'Picket' ? (
                  <div className="space-y-6">
                    <div className="rounded-xl border bg-secondary/30 p-4">
                      <p className="mb-3 font-semibold">Schedule Period</p>
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
                      <label
                        htmlFor="picket-schedule-file"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handlePicketFileDrop}
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-secondary/30 px-4 py-10 text-center transition-colors hover:bg-secondary/50"
                      >
                        <CloudArrowUpIcon className="size-10 text-primary" />
                        <p className="text-sm font-medium">Drag your file(s)</p>
                        <p className="text-xs text-muted-foreground">
                          {pickedFileName ? `Loaded: ${pickedFileName}` : '.xlsx (filled-in template)'}
                        </p>
                        <input
                          id="picket-schedule-file"
                          type="file"
                          accept=".xlsx"
                          onChange={handlePicketFileChange}
                          className="hidden"
                        />
                      </label>

                      {unmatchedNames.length > 0 && (
                        <p className="mt-2 text-xs text-destructive">
                          Not found in the member list, skipped: {unmatchedNames.join(', ')}
                        </p>
                      )}

                      {ambiguousNames.length > 0 && (
                        <p className="mt-2 text-xs text-destructive">
                          Multiple members share this name, skipped: {ambiguousNames.join(', ')}
                        </p>
                      )}

                      {duplicateDayNames.length > 0 && (
                        <p className="mt-2 text-xs text-destructive">
                          Assigned to more than one day, skipped from all of them: {duplicateDayNames.join(', ')}
                        </p>
                      )}

                      {days.some(day => (assignedUsers[day] || []).length > 0) && (
                        <div className="mt-3 space-y-2">
                          {days.map(day => {
                            const ids = assignedUsers[day] || [];
                            if (ids.length === 0) return null;
                            const names = ids.map(getUserLabel).filter((n): n is string => !!n);
                            return (
                              <div key={day} className="flex flex-col gap-1 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                                <p className="shrink-0 text-sm font-medium sm:w-28">{day}</p>
                                <p className="min-w-0 flex-1 text-sm text-muted-foreground">{names.join(', ')}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {thematicEntries.map((entry, idx) => {
                      const otherDates = thematicEntries
                        .filter((_, i) => i !== idx)
                        .map(e => e.date)
                        .filter((d): d is string => !!d);
                      const selectedNames = entry.assignedUsers.map(getUserLabel).filter((n): n is string => !!n);
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
                            options={userOptions}
                            title='Select Member'
                            value={entry.assignedUsers}
                            displayValue={
                              selectedNames.length > maxNames
                                ? [...selectedNames.slice(0, maxNames), '...']
                                : selectedNames
                            }
                            onChange={(ids: string[]) => updateThematicEntryUsers(idx, ids)}
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
                <div className="flex flex-col gap-3">
                  {futureSchedules.length > 0 && (
                    <div className="rounded-xl border bg-secondary/30 p-4">
                      <p className="mb-3 font-semibold">Delete a Date Range</p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button
                          type="button"
                          className="min-w-0 flex-1 rounded-full border border-muted-foreground bg-white px-2 py-4 text-base font-light text-black hover:bg-primary hover:text-white"
                          onClick={() => { if (!showDeleteRangeModal) setShowDeleteRangeModal(true); }}
                        >
                          {deleteRangeStart && deleteRangeEnd && deleteRangeStart !== deleteRangeEnd
                            ? `${formatFriendlyDate(deleteRangeStart)} – ${formatFriendlyDate(deleteRangeEnd)}`
                            : deleteRangeStart
                            ? formatFriendlyDate(deleteRangeStart)
                            : 'Select Date Range'}
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="shrink-0 text-sm"
                          disabled={isBulkDeleting || schedulesInDeleteRange.length === 0}
                          onClick={handleBulkDeleteRange}
                        >
                          Delete All in Range ({schedulesInDeleteRange.length})
                        </Button>
                      </div>
                      {showDeleteRangeModal && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center"
                          style={{ background: 'transparent' }}
                          onClick={() => setShowDeleteRangeModal(false)}
                        >
                          <div className="rounded bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <DateRangePicker
                              startDate={deleteRangeStart}
                              endDate={deleteRangeEnd}
                              minDate={todayIso()}
                              onChange={(start, end) => {
                                setDeleteRangeStart(start);
                                setDeleteRangeEnd(end);
                              }}
                            />
                            <div className="mt-4 flex justify-end gap-2">
                              <Button
                                type="button"
                                onClick={() => { if (deleteRangeStart) setShowDeleteRangeModal(false); }}
                              >
                                Select
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-none">
                    {futureSchedules.length === 0 && (
                      <EmptyState message={`No future ${activeTab.toLowerCase()} schedules.`} className="py-8" />
                    )}
                    {futureSchedules.map(sch => {
                      const dateObj = new Date(sch.date);
                      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                      const dateStr = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                      const isInDeleteRange = deleteRangeIds.has(sch._id);
                      return (
                        <div
                          key={sch._id}
                          className={
                            isInDeleteRange
                              ? 'flex items-center gap-3 rounded-xl border border-primary/20 border-l-4 border-l-primary bg-primary/5 px-4 py-3 transition-colors'
                              : 'flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-destructive/40 hover:bg-destructive/5'
                          }
                        >
                          <div className="min-w-0 flex-1">
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
                </div>
              </DialogField>
            </div>
          </div>
          <div>
            {activeTab === 'Picket' ? (
              <PicketScheduleTable fetchTrigger={fetchTrigger} date={viewDate} />
            ) : (
              <MonthlyThematicScheduleList schedules={thematicSchedules} loading={thematicLoading} onSwap={handleThematicSwap} />
            )}
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
}

export default Schedule
