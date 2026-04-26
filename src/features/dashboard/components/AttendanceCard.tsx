
import CardField from '@/components/custom-ui/CardField';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { getAttendance, postCheckIn, postLeaveRequest, postCheckOut } from '@/services/attendance/attendanceService';
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
// import CameraCapture from '@/components/custom-ui/CameraCapture';
import DateRangePicker from '@/components/custom-ui/DateRangePicker';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpRightIcon } from 'lucide-react';
import { showErrorToast } from '@/lib/toastHelper';
import { toast } from 'sonner';
import CameraCapture from '@/components/custom-ui/CameraCapture';

const AttendanceCard = () => {
  const { user } = useAuth();
  const localDeviceId = localStorage.getItem('device_id');
  const isDeviceIdMatch =  user?.device_id === localDeviceId;
  const [showDateModal, setShowDateModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'sick' | 'permit'>('sick');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveAttachment, setLeaveAttachment] = useState<File | null>(null);
  // const [leaveLoading, setLeaveLoading] = useState(false);
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

  const handlePermissionSubmit = async () => {
    if (!leaveType || !leaveReason || !leaveStartDate || !leaveAttachment) {
      toast.error('Semua field wajib diisi!');
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
      toast.success('Sukses mengirim izin!');
      const day = new Date().getDay(); 
      let telegramUsername = 'favianjiwani';
      if (day === 2 || day === 5) telegramUsername = 'Ravarazan'; 
      else if (day === 4 || day === 6) telegramUsername = 'Erwinhafizz'; 
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
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 9 && hour <= 10) {
      setDialogOpen(true);
      return;
    }
    await submitCheckin('');
  };

  const submitCheckin = async (reasonValue: string) => {
    setCheckinLoading(true);
    try {
      await postCheckIn(localDeviceId ?? '', reasonValue);
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
    } catch (error: unknown) {
      let errMsg = "Gagal melakukan check-in.";
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
    if (!user?.device_id) {
      showErrorToast("Device ID kosong. Tidak bisa melakukan check-out.", { duration: 5000 });
      return;
    }
    setCheckinLoading(true);
    try {
      await postCheckOut(user.device_id);
      toast.success("Check-out berhasil!");
      setIsCheckedOut(true);
    } catch (error) {
      let errMsg = "Gagal melakukan check-out.";
      if (error && typeof error === "object") {
        errMsg = (error as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message
          || (error as { message?: string })?.message
          || errMsg;
      }
      toast.error(errMsg);
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
            } else if (hour >= 17 && hour < 24) {
              const late = hour > 19;
              return (
                <>
                  <Button 
                    onClick={handleCheckout} 
                    className='h-28 cursor-pointer'
                    disabled={
                      checkinLoading ||
                      late ||
                      isIpAllowed === false ||
                      isIpAllowed === null
                    }
                    variant="link"
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
                      isIpAllowed === null 
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
                      isIpAllowed === null 
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
                    <p className="text-center text-sm mt-32">
                      Check-out is only allowed from 5 PM to 7 PM.
                    </p>
                  ): (
                    <p className="text-center text-sm mt-32">
                      Check-in is only allowed from 6 AM to 10 AM.
                    </p>
                  )}
                  
                </>
              );
            }
          })()
        )}
        {hour >= 6 && hour < 10 && !isCheckedIn && (
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
                    onClick={() => {
                      if (!showDateModal) {
                        setShowDateModal(true);
                      }
                    }}
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
                          <Button type="button" onClick={() => {
                            if (leaveStartDate) {
                              setShowDateModal(false);
                            }
                          }}>
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
                  {/* <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="block w-full rounded-lg border border-gray-700 p-1 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#232329] file:text-white hover:file:bg-primary/80"
                    onChange={async e => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        if (["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
                          try {
                            const compressedFile = await imageCompression(file, {
                              maxSizeMB: 0.5, 
                              maxWidthOrHeight: 1280,
                              useWebWorker: true
                            });
                            setLeaveAttachment(compressedFile);
                          } catch {
                            setLeaveAttachment(file); 
                          }
                        } else {
                          setLeaveAttachment(file);
                        }
                      }
                    }}
                  /> */}
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