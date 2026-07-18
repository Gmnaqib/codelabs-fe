
import CardField from '@/components/custom-ui/CardField';
import Image from 'next/image';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { postCheckIn, postCheckOut, checkNetwork, getMyStatusToday, getMyLeaveRequestToday } from '@/services/attendance/attendanceService';
import { getTimeSettingByCode, TimeSetting } from '@/services/timeSetting/timeSettingService';

import { useAuth } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import LeaveRequestForm from '@/features/attendance/components/LeaveRequestForm';

import { toast } from 'sonner';

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m ?? 0);
};

const getDayCode = (): "WEEKDAY" | "WEEKEND" | "SUNDAY" => {
  const day = new Date().getDay();
  if (day === 0) return "SUNDAY";
  if (day === 6) return "WEEKEND";
  return "WEEKDAY";
};

const AttendanceCard = () => {
  const { user } = useAuth();
  const [isOnNetwork, setIsOnNetwork] = useState<boolean | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean | null>(null);
  const [isCheckedOut, setIsCheckedOut] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [timeSetting, setTimeSetting] = useState<TimeSetting | null>(null);
  const [leaveToday, setLeaveToday] = useState<{ type: string; status: string } | null>(null);
  const [nowMin, setNowMin] = useState(() => {
    const n = new Date();
    return (n.getUTCHours() * 60 + n.getUTCMinutes() + 7 * 60) % (24 * 60);
  });

  const dayCode = getDayCode();
  const isSunday = dayCode === "SUNDAY";

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setNowMin((n.getUTCHours() * 60 + n.getUTCMinutes() + 7 * 60) % (24 * 60));
    };
    const id = setInterval(tick, 5_000);
    return () => clearInterval(id);
  }, []);

  const canCheckIn = timeSetting
    ? nowMin >= toMin(timeSetting.checkin) && nowMin < toMin(timeSetting.checkinlatelimit)
    : false;
  const isLateCheckin = timeSetting
    ? nowMin >= toMin(timeSetting.checkinlimit) && nowMin < toMin(timeSetting.checkinlatelimit)
    : false;
  const canCheckOut = timeSetting
    ? nowMin >= toMin(timeSetting.checkout) && nowMin <= toMin(timeSetting.checkoutlate)
    : false;
  const isPastCheckout = timeSetting
    ? nowMin > toMin(timeSetting.checkoutlate)
    : false;

  useEffect(() => {
    checkNetwork().then(setIsOnNetwork).catch(() => setIsOnNetwork(false));
  }, []);

  useEffect(() => {
    if (isSunday) return;
    getTimeSettingByCode(dayCode).then(setTimeSetting).catch(() => setTimeSetting(null));
  }, [dayCode, isSunday]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) return;

      try {
        const status = await getMyStatusToday();
        setIsCheckedIn(status.checkedIn);
        setIsCheckedOut(status.checkedOut);
      } catch {
        setIsCheckedIn(false);
      }
      setLoading(false);
    };
    fetchAttendance();
  }, [user]);

  useEffect(() => {
    const fetchLeaveToday = async () => {
      if (!user) return;
      try {
        const res = await getMyLeaveRequestToday();
        setLeaveToday(res ? { type: res.type, status: res.status || 'pending' } : null);
      } catch {
        setLeaveToday(null);
      }
    };
    fetchLeaveToday();
  }, [user]);

  const handleCheckin = async () => {
    if (!isOnNetwork) {
      toast.error('You must be connected to the Codelabs network to check in.');
      return;
    }
    if (isLateCheckin) {
      setDialogOpen(true);
      return;
    }
    await submitCheckin('');
  };

  const submitCheckin = async (reasonValue: string) => {
    if (!isOnNetwork) {
      toast.error('You must be connected to the Codelabs network to check in.');
      setDialogOpen(false);
      return;
    }
    setCheckinLoading(true);
    try {
      await postCheckIn(reasonValue);
      toast.success("Check-in successful!");
      setIsCheckedIn(true);
      setDialogOpen(false);
      setReason('');
    } catch (error: unknown) {
      let errMsg = "Failed to check in.";
      if (error && typeof error === "object") {
        errMsg = (error as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message
          || (error as { message?: string })?.message
          || errMsg;
      }
      toast.error(errMsg);
    }
    setCheckinLoading(false);
  };

  const handleCheckout = async () => {
    if (!isOnNetwork) {
      toast.error('You must be connected to the Codelabs network to check out.');
      setDialogOpen(false);
      return;
    }
    setCheckinLoading(true);
    try {
      await postCheckOut();
      toast.success("Check-out successful!");
      setIsCheckedOut(true);
    } catch (error) {
      let errMsg = "Failed to check out.";
      if (error && typeof error === "object") {
        errMsg = (error as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message
          || (error as { message?: string })?.message
          || errMsg;
      }
      toast.error(errMsg);
    }
    setCheckinLoading(false);
  };

  const renderCheckinButton = () => (
    <Button
      onClick={handleCheckin}
      variant="link"
      className='h-28 cursor-pointer'
      disabled={checkinLoading || !isOnNetwork}
    >
      <div
        className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-sm animate-glow"
        style={{ background: 'linear-gradient(225deg, #2080D9 0%, #A1CDF6 100%)' }}
      >
        <Image src="/icon/attendance-hand.png" alt="Icon Check-In" width={40} height={40} />
        <p className="text-white text-sm mt-2">CHECK IN</p>
      </div>
    </Button>
  );

  const renderCheckoutButton = () => (
    <Button
      onClick={handleCheckout}
      className='h-28 cursor-pointer'
      disabled={checkinLoading || !isOnNetwork}
      variant="link"
    >
      <div
        className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-sm animate-glow"
        style={{ background: 'linear-gradient(225deg, #2080D9 0%, #A1CDF6 100%)' }}
      >
        <Image src="/icon/attendance-hand.png" alt="Icon Check-Out" width={40} height={40} />
        <p className="text-white text-sm mt-2">CHECK OUT</p>
      </div>
    </Button>
  )

  const LEAVE_STATUS_STYLES: Record<string, { gradient: string; icon: typeof CheckIcon; label: string; message: string }> = {
    approved: {
      gradient: 'linear-gradient(225deg, #16A34A 0%, #A7F3D0 100%)',
      icon: CheckIcon,
      label: 'ACCEPTED',
      message: 'Your leave request for today has been approved.',
    },
    rejected: {
      gradient: 'linear-gradient(225deg, #DC2626 0%, #FCA5A5 100%)',
      icon: XMarkIcon,
      label: 'REJECTED',
      message: 'Your leave request for today was rejected.',
    },
    pending: {
      gradient: 'linear-gradient(225deg, #D97706 0%, #FDE68A 100%)',
      icon: ClockIcon,
      label: 'PENDING',
      message: 'Your leave request for today is waiting for approval.',
    },
  };

  const renderLeaveStatus = (type: string, status: string) => {
    const style = LEAVE_STATUS_STYLES[status] ?? LEAVE_STATUS_STYLES.pending;
    const StatusIcon = style.icon;
    return (
      <>
        <div
          className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-sm animate-glow"
          style={{ background: style.gradient }}
        >
          <StatusIcon className="w-12 h-12 text-white" strokeWidth={3} />
          <p className="text-white text-sm mt-2">{style.label}</p>
        </div>
        <p className="text-center text-sm mt-8 capitalize">
          {type} request &mdash; {style.message}
        </p>
      </>
    );
  };

  return (
    <CardField title="Attendance" icon={<CalendarDaysIcon />} bg>
      <div className="flex flex-col items-center">
        {isSunday ? (
          <>
            <Button disabled variant="link">
              <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center mt-16 bg-gray-300">
                <Image src="/icon/attendance-hand.png" alt="Icon Check-In" width={40} height={40} />
                <p className="text-white text-sm mt-2">CHECK IN</p>
              </div>
            </Button>
            <p className="text-center text-sm mt-32">Attendance is not available on Sunday.</p>
          </>
        ) : leaveToday ? (
          renderLeaveStatus(leaveToday.type, leaveToday.status)
        ) : loading || !timeSetting ? (
          <p className="text-center text-sm mt-5">Loading...</p>
        ) : isCheckedIn ? (
          <>
            {isCheckedOut ? (
              <>
                <Image src="/icon/attendance.png" alt="Icon Attendance" width={150} height={150} />
                <p className="text-center text-sm mt-5">
                  You are successfully check out today. See you tomorrow!
                </p>
              </>
            ) : canCheckOut ? (
              <>
                {renderCheckoutButton()}
                  <p className="text-center text-sm mt-8">
                    {isOnNetwork === false
                      ? "You must be connected to the Codelabs network to check out."
                      : "You have successfully checked in today. Don't forget to check out before leaving."}
                  </p>
              </>
            ) : isPastCheckout ? (
              <>
                <Button disabled variant="link" className='h-28'>
                  <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center bg-gray-300">
                    <Image src="/icon/attendance-hand.png" alt="Icon Check-Out" width={40} height={40} />
                    <p className="text-white text-sm mt-2">CHECK OUT</p>
                  </div>
                </Button>
                <p className="text-center text-sm mt-8 text-red-500">
                  Checkout time has passed. Last checkout was at {timeSetting?.checkoutlate}.
                </p>
              </>
            ) : (
              <>
                <Image src="/icon/attendance.png" alt="Icon Attendance" width={150} height={150} />
                <p className="text-center text-sm mt-5">
                  Welcome to Codelabs! You are successfully check in today. Check-out available from {timeSetting.checkout}.
                </p>
              </>
            )}
          </>
        ) : (
          <>
            {canCheckIn ? (
              isLateCheckin ? (
                <>
                  <DialogField
                    name={
                      <div
                        className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-sm animate-glow mt-16"
                        style={{ background: 'linear-gradient(225deg, #2080D9 0%, #A1CDF6 100%)' }}
                      >
                        <Image src="/icon/attendance-hand.png" alt="Icon Check-In" width={40} height={40} />
                        <p className="text-white text-sm mt-2">CHECK IN</p>
                      </div>
                    }
                    title="You are late, please provide a reason"
                    variant="link"
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSubmit={() => submitCheckin(reason)}
                    onCancel={() => setDialogOpen(false)}
                    disabled={checkinLoading || !isOnNetwork}
                    submitDisabled={!reason.trim() || checkinLoading || !isOnNetwork}
                  >
                    <div className="flex flex-col gap-4">
                      <InputField
                        label=""
                        type="text"
                        placeholder="Reason for being late"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                      />
                    </div>
                  </DialogField>
                  <p className="text-center text-sm mt-24">
                    {isOnNetwork === false
                      ? "You must be connected to the Codelabs network to record attendance."
                      : "Welcome! You are late, please provide a reason for check-in."}
                  </p>
                </>
              ) : (
                <>
                  {renderCheckinButton()}
                  <p className="text-center text-sm mt-8">
                    {isOnNetwork === false
                      ? "You must be connected to the Codelabs network to record attendance."
                      : "You are connected. Tap the button to check in."}
                  </p>
                </>
              )
            ) : (
              <>
                <Button disabled variant="link">
                  <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center mt-16 bg-gray-300">
                    <Image src="/icon/attendance-hand.png" alt="Icon Check-In" width={40} height={40} />
                    <p className="text-white text-sm mt-2">CHECK IN</p>
                  </div>
                </Button>
                <p className="text-center text-sm mt-32">
                  Check-in is only available from {timeSetting.checkin} to {timeSetting.checkinlatelimit}.
                </p>
              </>
            )}
          </>
        )}
        {canCheckIn && !isCheckedIn && <LeaveRequestForm />}
      </div>
    </CardField>
  );
};

export default AttendanceCard;
