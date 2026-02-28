
import CardField from '@/components/custom-ui/CardField';
import Image from 'next/image';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { getAttendance, postCheckIn, postLeaveRequest } from '@/services/attendance/attendanceService';
import { useRef } from 'react';

type AttendanceRecord = {
  userId: string;
  checkIn?: string | Date;
  checkOut?: string | Date;
};

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import CameraCapture from '@/components/custom-ui/CameraCapture';
import DateRangePicker from '@/components/custom-ui/DateRangePicker';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpRightIcon } from 'lucide-react';
import { showErrorToast } from '@/lib/toastHelper';
import { toast } from 'sonner';
import '@/components/custom-ui/glow-animate.css';

const AttendanceCard = () => {
  const { user } = useAuth();
  const [showDateModal, setShowDateModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'sick' | 'permit'>('sick');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveAttachment, setLeaveAttachment] = useState<File | null>(null);
  // const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveResult, setLeaveResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean | null>(null);
  const [isCheckedOut, setIsCheckedOut] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isIpAllowed, setIsIpAllowed] = useState<boolean | null>(null);
  const now = new Date();
  const hour = now.getHours();

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) {
        setIsCheckedIn(false);
        setLoading(false);
        return;
      }
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      try {
        type AttendanceRecord = {
          userId: string;
          checkIn?: string | Date;
          checkOut?: string | Date;
        };
        const data: AttendanceRecord[] = await getAttendance(year, month);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const todayLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const found = data.find((item: AttendanceRecord) => {
          if (item.userId !== user.id || !item.checkIn) return false;
          const checkInDate = new Date(item.checkIn);
          const checkInLocal = `${checkInDate.getFullYear()}-${pad(checkInDate.getMonth() + 1)}-${pad(checkInDate.getDate())}`;
          return checkInLocal === todayLocal;
        });
        setIsCheckedIn(!!found);
        setIsCheckedOut(found && found.checkOut ? true : false);
      } catch {
        setIsCheckedIn(false);
      }
      setLoading(false);
    };
    fetchAttendance();
  }, [user]);

  useEffect(() => {
  const checkIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();

        const userIp = data.ip;

        const UNIKOM_PREFIX = "103."; 

        const allowed = userIp.startsWith(UNIKOM_PREFIX);

        setIsIpAllowed(allowed);
      } catch {
        setIsIpAllowed(false);
      }
    };

    checkIp();
  }, []);


  const handleCheckin = async () => {
    if (!user) return;
    if (!user.device_id) {
       showErrorToast("Device ID kosong. Tidak bisa melakukan check-in.", { duration: 5000 });
      return;
    }
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 9) {
      setDialogOpen(true);
      return;
    }
    await submitCheckin('');
  };

  const submitCheckin = async (reasonValue: string) => {
    setCheckinLoading(true);
    try {
      await postCheckIn(user!.device_id!, reasonValue);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const pad = (n: number) => n.toString().padStart(2, '0');
      const todayLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const data: AttendanceRecord[] = await getAttendance(year, month);
      const found = data.find((item: AttendanceRecord) => {
        if (item.userId !== user!.id || !item.checkIn) return false;
        const checkInDate = new Date(item.checkIn);
        const checkInLocal = `${checkInDate.getFullYear()}-${pad(checkInDate.getMonth() + 1)}-${pad(checkInDate.getDate())}`;
        return checkInLocal === todayLocal;
      });
      toast.success("Check-in berhasil!");
      setIsCheckedIn(!!found);
      setDialogOpen(false);
      setReason('');
    } catch {
      toast.error("Gagal melakukan check-in.");
    }
    setCheckinLoading(false);
  };

  return (
    <CardField title="Attendance" icon={<CalendarDaysIcon />} bg>
      <div className="flex flex-col items-center">
        {loading ? (
          <p className="text-center text-sm mt-5">Loading...</p>
        ) : isCheckedIn ? (
          (() => {
            const now = new Date();
            const hour = now.getHours();
            if (isCheckedOut) {
              return (
                <>
                  <Image src="/icon/attendance.png" alt="Icon Attendance" width={150} height={150} />
                  <p className="text-center text-sm mt-5">
                    You are successfully check out today. See you tomorrow!
                  </p>
                </>
              );
            } else if (hour < 17) {
              return (
                <>
                  <Image src="/icon/attendance.png" alt="Icon Attendance" width={150} height={150} />
                  <p className="text-center text-sm mt-5">
                    Welcome to Codelabs! You are successfully check in today. Dont forget to check out at 5 PM.
                  </p>
                </>
              );
            } else if (hour >= 12 && hour < 24) {
              const isLate = hour >= 19;
              return (
                <>
                  <Button 
                    onClick={handleCheckin} 
                    disabled={
                      checkinLoading ||
                      isLate ||
                      isIpAllowed === false ||
                      isIpAllowed === null ||
                      !user?.device_id
                    }
                  >
                    <div
                      className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-sm animate-glow"
                      style={{
                        background: 'linear-gradient(225deg, #2080D9 0%, #A1CDF6 100%)'
                      }}
                    >
                      <Image 
                        src="/icon/attendance-hand.png" 
                        alt="Icon Check-Out" 
                        width={40} 
                        height={40} 
                      />
                      <p className="text-white text-sm mt-2">CHECK OUT</p>
                    </div>
                  </Button>
                  <p className="text-center text-sm mt-8">
                    You have to be in CodeLabs to do attendance &amp; If You will check out, you need check in first, please check in tomorrow on 6 AM - 10 AM.
                  </p>
                </>
              );
            }
            return null;
          })()
        ) : (
          (() => {
            if (hour >= 6 && hour < 9) {
              return (
                <>
                  <Button 
                    onClick={handleCheckin} 
                    variant="link" 
                    className='h-28 cursor-pointer'
                    disabled={
                      checkinLoading ||
                      isIpAllowed === false ||
                      isIpAllowed === null ||
                      !user?.device_id
                      
                    }
                  >
                    <div
                      className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-sm animate-glow"
                      style={{
                        background: 'linear-gradient(225deg, #2080D9 0%, #A1CDF6 100%)'
                      }}
                    >
                      <Image 
                        src="/icon/attendance-hand.png" 
                        alt="Icon Check-In" 
                        width={40} 
                        height={40} 
                      />
                      <p className="text-white text-sm mt-2">CHECK IN</p>
                    </div>
                  </Button>
                  <p className="text-center text-sm mt-8">
                    You have to be in CodeLabs to do attendance &amp; If You will check out, you need check in first, please check in tomorrow on 6 AM - 10 AM.
                  </p>
                </>
              );
            } else if (hour >= 9 && hour < 10) {
              return (
                <>
                  <DialogField
                    name={
                      <div
                        className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-sm animate-glow mt-16"
                        style={{
                          background: 'linear-gradient(225deg, #2080D9 0%, #A1CDF6 100%)'
                        }}
                      >
                        <Image 
                          src="/icon/attendance-hand.png" 
                          alt="Icon Check-In" 
                          width={40} 
                          height={40} 
                        />
                        <p className="text-white text-sm mt-2">CHECK IN</p>
                      </div>
                    }
                    title="State the reason why you are late"
                    variant="link" 
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSubmit={() => submitCheckin(reason)}
                    onCancel={() => setDialogOpen(false)}
                    disabled={
                      checkinLoading ||
                      isIpAllowed === false ||
                      isIpAllowed === null ||
                      !user?.device_id
                    }
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
                    You have to be in CodeLabs to do attendance &amp; If You will check out, you need check in first, please check in tomorrow on 6 AM - 10 AM.
                  </p>
                </>
              );
            } else {
              return (
                <>
                  <Button disabled variant="link">
                    <div
                      className="w-32 h-32 rounded-full flex flex-col items-center justify-center mt-16 bg-gray-300"
                    >
                      <Image 
                        src="/icon/attendance-hand.png" 
                        alt="Icon Check-Out" 
                        width={40} 
                        height={40} 
                      />
                      {isCheckedIn ? (
                        <p className="text-white text-sm mt-2">CHECK OUT</p>
                      ) : (
                        <p className="text-white text-sm mt-2">CHECK IN</p>
                      )}
                    </div>
                  </Button>
                  {isCheckedIn ? (
                    <p className="text-center text-sm mt-24">
                      Check-out is only allowed from 5 PM to 7 PM.
                    </p>
                  ): (
                    <p className="text-center text-sm mt-24">
                      Check-in is only allowed from 6 AM to 10 AM.
                    </p>
                  )}
                  
                </>
              );
            }
          })()
        )}
        {hour >= 6 && hour < 10 && !isCheckedIn && (
          <div className="flex items-center gap-2 mt-3">
            <DialogField name='Add Permission' title='Permission' variant='link' size='noPadding'
              onSubmit={async () => {
                if (!leaveReason || !leaveStartDate || !leaveEndDate || !leaveAttachment) {
                  setLeaveResult('Semua field wajib diisi!');
                  return;
                }
                setLeaveResult(null);
                try {
                  await postLeaveRequest({
                    type: leaveType,
                    reason: leaveReason,
                    attachment: leaveAttachment,
                    start_date: leaveStartDate,
                    end_date: leaveEndDate,
                  });
                  setLeaveResult('Sukses mengirim izin!');
                  setLeaveReason('');
                  setLeaveStartDate('');
                  setLeaveEndDate('');
                  setLeaveAttachment(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                } catch {
                  setLeaveResult('Gagal mengirim izin!');
                }
              }}
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
                  <label className="block text-sm font-medium mb-1">Leave Date</label>
                  <button
                    type="button"
                    className="border rounded-lg px-2 py-1 w-full text-left bg-white"
                    onClick={() => setShowDateModal(true)}
                  >
                    {leaveStartDate && leaveEndDate && leaveStartDate !== leaveEndDate
                      ? `${leaveStartDate} s/d ${leaveEndDate}`
                      : leaveStartDate
                      ? leaveStartDate
                      : 'Select leave date'}
                  </button>
                  {showDateModal && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center"
                      onClick={() => setShowDateModal(false)}
                      style={{ background: 'transparent' }}
                    >
                      <div
                        className="bg-white rounded shadow-lg p-4"
                        onClick={() => {}}
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
                          <Button type="button" onClick={() => setShowDateModal(false)}>
                            Pilih
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                  
                <div>
                  <label className="block text-sm font-medium mb-1">Take Picture</label>
                  <CameraCapture onCapture={file => setLeaveAttachment(file)} />
                  {leaveAttachment && <span className="text-xs">Foto sudah diambil</span>}
                </div>
                {leaveResult && <p className="text-xs text-center mt-2">{leaveResult}</p>}
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