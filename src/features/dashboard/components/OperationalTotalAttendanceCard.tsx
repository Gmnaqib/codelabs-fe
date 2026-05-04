import React, { useEffect, useState } from 'react'
import CardField from '@/components/custom-ui/CardField'
import { MegaphoneIcon } from '@heroicons/react/24/solid'
import DialogField from '@/components/custom-ui/DialogField';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

const OperationalTotalAttendanceCard = () => {

  const [lateTodayCount, setLateTodayCount] = useState(0);
  const [lateTodayNames, setLateTodayNames] = useState<string[]>([]);
  const [absentCount, setAbsentCount] = useState(0);
  const [absentNames, setAbsentNames] = useState<string[]>([]);
  const [leaveExceededCount, setLeaveExceededCount] = useState(0);
  const [sickExceededCount, setSickExceededCount] = useState(0);
  const [leaveExceededNames, setLeaveExceededNames] = useState<string[]>([]);
  const [sickExceededNames, setSickExceededNames] = useState<string[]>([]);

  useEffect(() => {
    async function fetchAttendanceAndUsers() {
      try {
        const [attendanceService, userService] = await Promise.all([
          import('@/services/attendance/attendanceService'),
          import('@/services/users/userService'),
        ]);
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const [attendanceData, allUsers, attendanceSummary] = await Promise.all([
          attendanceService.getAttendanceToday(),
          userService.getAllUsers(),
          attendanceService.getAttendanceSummary(year, month),
        ]);

        let lateNames: string[] = [];
        let lateCount = 0;
        if (Array.isArray(attendanceData) && Array.isArray(allUsers)) {
          const lateEntries = attendanceData.filter((item) => item.reason && item.checkIn !== null && item.reason.trim() !== '');
          lateCount = lateEntries.length;
          const userMap = new Map(allUsers.map((u: any) => [u._id, u.name]));
          lateNames = lateEntries.map((item) => userMap.get(item.userId) || '-');
        }
        setLateTodayCount(lateCount);
        setLateTodayNames(lateNames);

        const activeUsers = Array.isArray(allUsers)
          ? allUsers.filter((user) => user.status === 'active')
          : [];
        const attendanceUserIds = Array.isArray(attendanceData)
          ? attendanceData.map((item) => item.userId)
          : [];
        const absentUsers = activeUsers.filter((user) => !attendanceUserIds.includes(user._id));
        setAbsentCount(absentUsers.length);
        setAbsentNames(absentUsers.map((user) => user.name || '-'));

        const leaveExceeded = Array.isArray(attendanceSummary)
          ? attendanceSummary.filter((item) => item.counts && item.counts.permit && item.counts.permit > 2)
          : [];
        setLeaveExceededCount(leaveExceeded.length);
        setLeaveExceededNames(leaveExceeded.map((item) => item.userName || '-'));

        const sickExceeded = Array.isArray(attendanceSummary)
          ? attendanceSummary.filter((item) => item.counts && item.counts.sick && item.counts.sick > 4)
          : [];
        setSickExceededCount(sickExceeded.length);
        setSickExceededNames(sickExceeded.map((item) => item.userName || '-'));
      } catch (e) {
        setLateTodayCount(0);
        setAbsentCount(0);
        setLeaveExceededCount(0);
        setSickExceededCount(0);
      }
    }
    fetchAttendanceAndUsers();
  }, []);

  const menu = [
    {
      label: 'Absent',
      border: 'border-red-300',
      bg: 'bg-red-50',
      text: 'text-red-600',
      countBg: 'bg-red-100',
    },
    {
      label: 'Leave exceeded',
      border: 'border-orange-300',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      countBg: 'bg-orange-100',
    },
    {
      label: 'Sick exceeded',
      border: 'border-yellow-300',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      countBg: 'bg-yellow-100',
    },
    {
      label: 'Late today',
      border: 'border-green-300',
      bg: 'bg-green-50',
      text: 'text-green-600',
      countBg: 'bg-green-100',
    }
  ]
  return (
    <CardField title="Total Attendance" icon={<MegaphoneIcon />} bg>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col text-center gap-3">
          {menu.map((status) => {
            let count = 0;
            if (status.label === 'Absent') count = absentCount;
            else if (status.label === 'Leave exceeded') count = leaveExceededCount;
            else if (status.label === 'Sick exceeded') count = sickExceededCount;
            else if (status.label === 'Late today') count = lateTodayCount;
            return (
              <div
                key={status.label}
                className={`border-2 ${status.border} ${status.bg} rounded-full py-1.5 px-3`}
              >
                <div className={`flex justify-between ${status.text} items-center text-sm`}>
                  <p>{status.label}</p>
                  <div className={`${status.countBg} rounded-full py-1 px-3`}>
                    <p>{count} People</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <DialogField name="Total Attendance" title="Total Attendance Details" variant='link' noPaddingX noPadding>
            <div className='max-h-96 overflow-y-auto flex flex-col'>
              <p className='font-semibold text-red-600'>Absent</p>
              {absentNames.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {absentNames.map((name, idx) => <p key={name + idx}>{name}</p>)}
                </div>
              ) : (
                <p>There is no one absent.</p>
              )}
              <p className='font-semibold text-orange-600 mt-5'>Leave exceeded</p>
              {leaveExceededNames.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {leaveExceededNames.map((name, idx) => <p key={name + idx}>{name}</p>)}
                </div>
              ) : (
                <p>There is no leave that exceeds the limit.</p>
              )}
              <p className='font-semibold text-yellow-600 mt-5'>Sick exceeded</p>
              {sickExceededNames.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {sickExceededNames.map((name, idx) => <p key={name + idx}>{name}</p>)}
                </div>
              ) : (
                <p>There is no leave that exceeds the limit.</p>
              )}
              <p className='font-semibold text-green-600 mt-5'>Late today</p>
              {lateTodayNames.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {lateTodayNames.map((name, idx) => <p key={name + idx}>{name}</p>)}
                </div>
              ) : (
                <p>There is no one late today.</p>
              )}
            </div>
          </DialogField>
          <ArrowUpRightIcon className="text-primary text-base font-normal size-4" />
        </div>
      </div>
    </CardField>
  )
}

export default OperationalTotalAttendanceCard
