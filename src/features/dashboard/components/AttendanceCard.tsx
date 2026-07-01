
import CardField from '@/components/custom-ui/CardField';
import Image from 'next/image';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { postCheckIn, postLeaveRequest, postCheckOut, checkNetwork, getMyStatusToday } from '@/services/attendance/attendanceService';
import { getTimeSettingByCode, TimeSetting } from '@/services/timeSetting/timeSettingService';
import { useRef } from 'react';


import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import DateRangePicker from '@/components/custom-ui/DateRangePicker';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpRightIcon } from 'lucide-react';

import { toast } from 'sonner';
import CameraCapture from '@/components/custom-ui/CameraCapture';

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m ?? 0);
};

const getDayCode = (): "WEEKDAY" | "SATURDAY" | "SUNDAY" => {
  const day = new Date().getDay();
  if (day === 0) return "SUNDAY";
  if (day === 6) return "SATURDAY";
  return "WEEKDAY";
};

const AttendanceCard = () => {
  const { user } = useAuth();
  const [showDateModal, setShowDateModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'sick' | 'permit'>('sick');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveAttachment, setLeaveAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOnNetwork, setIsOnNetwork] = useState<boolean | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean | null>(null);
  const [isCheckedOut, setIsCheckedOut] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [timeSetting, setTimeSetting] = useState<TimeSetting | null>(null);

  const dayCode = getDayCode();
  const isSunday = dayCode === "SUNDAY";

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const canCheckIn = timeSetting
    ? nowMin >= toMin(timeSetting.checkin) && nowMin < toMin(timeSetting.checkinlatelimit)
    : false;
  const isLateCheckin = timeSetting
    ? nowMin >= toMin(timeSetting.checkinlimit) && nowMin < toMin(timeSetting.checkinlatelimit)
    : false;
  const canCheckOut = timeSetting
    ? nowMin >= toMin(timeSetting.checkout)
    : false;

  const handlePermissionSubmit = async () => {
    if (!leaveType || !leaveReason || !leaveStartDate || !leaveAttachment) {
      toast.error('All fields are required!');
      return;
    }
    const finalEndDate = leaveEndDate || leaveStartDate;
    try {
      await postLeaveRequest({
        type: leaveType,
        reason: leaveReason,
        attachment: leaveAttachment,
        start_date: leaveStartDate,
        end_date: finalEndDate,
      });
      toast.success('Leave request submitted successfully!');
      const day = new Date().getDay();
      let telegramUsername = 'HakimMajid123';
      if (day === 3 || day === 6) telegramUsername = 'iammmth';
      else if (day === 4 || day === 5) telegramUsername = 'Aldzikra';
      const reasonText = encodeURIComponent(`Saya izin tidak masuk karena ${leaveReason} dari tanggal ${leaveStartDate} hingga ${finalEndDate}`);
      window.location.href = `https://t.me/${telegramUsername}?text=${reasonText}`;
      setLeaveReason('');
      setLeaveStartDate('');
      setLeaveEndDate('');
      setLeaveAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: unknown) {
      let errMsg = 'Gagal mengirim izin!';
      if (error && typeof error === 'object') {
        errMsg = (error as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message
          || (error as { message?: string })?.message
          || errMsg;
      }
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    checkNetwork().then(setIsOnNetwork).catch(() => setIsOnNetwork(false));
  }, []);

  useEffect(() => {
    if (isSunday) return;
    getTimeSettingByCode(dayCode).then(setTimeSetting).catch(() => setTimeSetting(null));
  }, [dayCode, isSunday]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) {
        setIsCheckedIn(false);
        setLoading(false);
        return;
      }
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

  const handleCheckin = async () => {
    if (isLateCheckin) {
      setDialogOpen(true);
      return;
    }
    await submitCheckin('');
  };

  const submitCheckin = async (reasonValue: string) => {
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
      disabled={checkinLoading}
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
                <Button
                  onClick={handleCheckout}
                  className='h-28 cursor-pointer'
                  disabled={checkinLoading}
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
                <p className="text-center text-sm mt-8">
                  You have successfully checked in today. Don&apos;t forget to check out before leaving.
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
                    disabled={checkinLoading}
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
        {canCheckIn && !isCheckedIn && (
          <div className="flex items-center gap-2 mt-3 cursor-pointer">
            <DialogField name='Add Permission' title='Permission' variant='link' size='noPadding'
              onSubmit={handlePermissionSubmit}
            >
              <div>
                <p className='mb-1'>Select Permission</p>
                <DropdownField
                  title={leaveType === 'sick' ? 'Sick' : 'Permit'}
                  menu={["Sick", "Permit"]}
                  onSelect={v => setLeaveType(v === 'Sick' ? 'sick' : 'permit')}
                />
              </div>
              <div className="flex flex-col gap-4">
                <Textarea
                  label="Reason"
                  placeholder="Enter reason..."
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                />
                <div>
                  <label className="block mb-1">Leave Date</label>
                  <Button
                    type='button'
                    className='rounded-full px-2 py-4 w-full text-base bg-white text-black border border-muted-foreground font-light hover:bg-primary hover:text-white'
                    onClick={() => { if (!showDateModal) setShowDateModal(true); }}
                  >
                    {leaveStartDate && leaveEndDate && leaveStartDate !== leaveEndDate
                      ? `${leaveStartDate} s/d ${leaveEndDate}`
                      : leaveStartDate
                      ? leaveStartDate
                      : 'Select Leave Date'}
                  </Button>
                  {showDateModal && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center"
                      style={{ background: 'transparent' }}
                      onClick={() => setShowDateModal(false)}
                    >
                      <div
                        className="bg-white rounded shadow-lg p-4"
                        onClick={e => e.stopPropagation()}
                      >
                        <DateRangePicker
                          startDate={leaveStartDate || null}
                          endDate={leaveEndDate || null}
                          minDate={new Date().toISOString().split('T')[0]}
                          onChange={(start, end) => {
                            setLeaveStartDate(start || '');
                            setLeaveEndDate(end || '');
                          }}
                        />
                        <div className="flex gap-2 mt-4 justify-end">
                          <Button type="button" onClick={() => { if (leaveStartDate) setShowDateModal(false); }}>
                            Pilih
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {!leaveAttachment ? (
                  <div>
                    <label className="block text-base font-light mb-1">Choose Picture</label>
                    <CameraCapture onCapture={file => setLeaveAttachment(file)} />
                  </div>
                ) : (
                  <span className="text-base text-center mt-1 text-primary">Foto sudah diambil</span>
                )}
              </div>
            </DialogField>
            <ArrowUpRightIcon className="size-5 text-primary" />
          </div>
        )}
      </div>
    </CardField>
  );
};

export default AttendanceCard;
