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
      <div className="flex flex-col gap-4 flex-1 justify-between">
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
            <div className='max-h-96 overflow-y-auto flex flex-col gap-6 pr-1'>
              <section>
                <p className='font-semibold text-red-600 mb-2'>Absent</p>
                {absentNames.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {absentNames.map((name, idx) => (
                      <span key={name + idx} className="text-sm bg-red-50 text-red-700 rounded-md px-2.5 py-1 text-center truncate">
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>There is no one absent.</p>
                )}
              </section>

              <section>
                <p className='font-semibold text-orange-600 mb-2'>Leave exceeded</p>
                {leaveExceededList.length > 0 ? (
                  <div className="flex flex-col divide-y divide-gray-100">
                    {leaveExceededList.map((item, idx) => (
                      <div key={item.name + idx} className="flex items-center justify-between gap-4 py-2 text-sm">
                        <span>{item.name}</span>
                        <span className="font-semibold text-orange-600 shrink-0">{item.count}x</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>There is no leave that exceeds the limit.</p>
                )}
              </section>

              <section>
                <p className='font-semibold text-yellow-600 mb-2'>Sick exceeded</p>
                {sickExceededList.length > 0 ? (
                  <div className="flex flex-col divide-y divide-gray-100">
                    {sickExceededList.map((item, idx) => (
                      <div key={item.name + idx} className="flex flex-col gap-0.5 py-2 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span>{item.name}</span>
                          <span className="font-semibold text-yellow-600 shrink-0">{item.count}x</span>
                        </div>
                        {item.reason && <span className="text-xs text-gray-400">{item.reason}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>There is no leave that exceeds the limit.</p>
                )}
              </section>

              <section>
                <p className='font-semibold text-green-600 mb-2'>Late today</p>
                {lateTodayList.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {lateTodayList.map((item, idx) => (
                      <div key={item.name + idx} className="flex items-start justify-between gap-4 border border-green-100 rounded-md px-3 py-2 text-sm">
                        <span className="font-medium shrink-0">{item.name}</span>
                        <span className="text-gray-500 text-right">{item.reason}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>There is no one late today.</p>
                )}
              </section>
            </div>
          </DialogField>
          <ArrowUpRightIcon className="text-primary text-base font-normal size-4" />
        </div>
      </div>
    </CardField>
  )
}

export default OperationalTotalAttendanceCard
