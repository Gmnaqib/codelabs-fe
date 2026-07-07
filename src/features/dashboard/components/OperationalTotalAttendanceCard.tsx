import React from 'react'
import CardField from '@/components/custom-ui/CardField'
import { MegaphoneIcon } from '@heroicons/react/24/solid'
import DialogField from '@/components/custom-ui/DialogField';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { useAttendanceSummaryCard } from '@/features/dashboard/hooks';

const OperationalTotalAttendanceCard = () => {
  const {
    lateTodayCount,
    lateTodayList,
    absentCount,
    absentNames,
    leaveExceededCount,
    sickExceededCount,
    leaveExceededList,
    sickExceededList,
  } = useAttendanceSummaryCard();

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
              {leaveExceededList.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {leaveExceededList.map((item, idx) => (
                    <p key={item.name + idx}>{item.name} <span className="font-semibold">({item.count}x)</span></p>
                  ))}
                </div>
              ) : (
                <p>There is no leave that exceeds the limit.</p>
              )}
              <p className='font-semibold text-yellow-600 mt-5'>Sick exceeded</p>
              {sickExceededList.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {sickExceededList.map((item, idx) => (
                    <div key={item.name + idx} className="flex flex-col">
                      <span>{item.name} <span className="font-semibold">({item.count}x)</span></span>
                      {item.reason && <span className="text-xs text-gray-400">{item.reason}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p>There is no leave that exceeds the limit.</p>
              )}
              <p className='font-semibold text-green-600 mt-5'>Late today</p>
              {lateTodayList.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {lateTodayList.map((item, idx) => (
                    <div key={item.name + idx} className="flex flex-col">
                      <p className='font-medium'>{item.name}</p>
                      <p>{item.reason}</p>
                      <hr />
                    </div>
                  ))}
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
