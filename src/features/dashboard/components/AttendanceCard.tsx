
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

const AttendanceCard = () => {
  const { user } = useAuth();
  // State untuk form leave request (PINDAHKAN KE SINI)
    // State untuk modal date picker
    const [showDateModal, setShowDateModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'sick' | 'permit'>('sick');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveAttachment, setLeaveAttachment] = useState<File | null>(null);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveResult, setLeaveResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean | null>(null);
  const [isCheckedOut, setIsCheckedOut] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');

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

  const handleCheckin = async () => {
    if (!user || !user.device_id) return;
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
      setIsCheckedIn(!!found);
      setDialogOpen(false);
      setReason('');
    } catch {
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
            // const minute = now.getMinutes();
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
              const isLate = hour >= 18;
              return (
                <>
                  <Button onClick={handleCheckin} disabled={checkinLoading || isLate}>
                    {checkinLoading ? 'Checking out...' : 'Checkin-out'}
                  </Button>
                  <p className="text-center text-sm mt-5">
                    checkout
                  </p>
                </>
              );
            }
            return null;
          })()
        ) : (
          (() => {
            const now = new Date();
            const hour = now.getHours();
            if (hour >= 0 && hour < 9) {
              return (
                <>
                  <Button onClick={handleCheckin} disabled={checkinLoading}>
                    {checkinLoading ? 'Checking in...' : 'Checkin-in'}
                  </Button>
                  <p className="text-center text-sm mt-5">
                    You have to be in CodeLabs to do attendance &amp; If You will check out, you need check in first, please check in tomorrow on 6 AM - 10 AM.
                  </p>
                </>
              );
            } else if (hour >= 9 && hour < 10) {
              return (
                <>
                  <DialogField
                    name="Check-in"
                    title="State the reason why you are late"
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSubmit={() => submitCheckin(reason)}
                    onCancel={() => setDialogOpen(false)}
                  >
                    <div className="flex flex-col gap-4">
                      <InputField
                        label=""
                        type="text"
                        placeholder="Masukkan alasan..."
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                      />
                    </div>
                  </DialogField>
                  <p className="text-center text-sm mt-5">
                    You have to be in CodeLabs to do attendance &amp; If You will check out, you need check in first, please check in tomorrow on 6 AM - 10 AM.
                  </p>
                </>
              );
            } else {
              return (
                <>
                  <Button disabled>
                    Checkin closed
                  </Button>
                  <p className="text-center text-sm mt-5">
                    Check-in is only allowed from 6 AM to 10 AM.
                  </p>
                </>
              );
            }
          })()
        )}
        <DialogField name='Add Permission' title='Permission'
          onSubmit={async () => {
            if (!leaveReason || !leaveStartDate || !leaveEndDate || !leaveAttachment) {
              setLeaveResult('Semua field wajib diisi!');
              return;
            }
            setLeaveLoading(true);
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
            } catch (e) {
              setLeaveResult('Gagal mengirim izin!');
            }
            setLeaveLoading(false);
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
              placeholder="Masukkan alasan..."
              value={leaveReason}
              onChange={e => setLeaveReason(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Izin</label>
              <button
                type="button"
                className="border rounded px-2 py-1 w-full text-left bg-white"
                onClick={() => setShowDateModal(true)}
              >
                {leaveStartDate && leaveEndDate && leaveStartDate !== leaveEndDate
                  ? `${leaveStartDate} s/d ${leaveEndDate}`
                  : leaveStartDate
                  ? leaveStartDate
                  : 'Pilih tanggal izin'}
              </button>
              {showDateModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  onClick={() => setShowDateModal(false)}
                  style={{ background: 'transparent' }}
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
                      <Button type="button" onClick={() => setShowDateModal(false)}>
                        Pilih
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
              
            <div>
              <label className="block text-sm font-medium mb-1">Ambil Foto (Wajib Kamera)</label>
              <CameraCapture onCapture={file => setLeaveAttachment(file)} />
              {leaveAttachment && <span className="text-xs">Foto sudah diambil</span>}
            </div>
            {leaveResult && <p className="text-xs text-center mt-2">{leaveResult}</p>}
          </div>
        </DialogField>
      </div>
    </CardField>
  );
};

export default AttendanceCard;