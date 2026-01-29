
import CardField from '@/components/custom-ui/CardField';
import Image from 'next/image';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { getAttendance, postCheckIn } from '@/services/attendance/attendanceService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';

const AttendanceCard = () => {
  const { user } = useAuth();
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
        const data = await getAttendance(year, month);
        // Cari data checkin hari ini untuk user (pakai tanggal lokal, bukan UTC)
        const pad = (n: number) => n.toString().padStart(2, '0');
        const todayLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const found = data.find((item: any) => {
          if (item.userId !== user.id || !item.checkIn) return false;
          const checkInDate = new Date(item.checkIn);
          const checkInLocal = `${checkInDate.getFullYear()}-${pad(checkInDate.getMonth() + 1)}-${pad(checkInDate.getDate())}`;
          return checkInLocal === todayLocal;
        });
        setIsCheckedIn(!!found);
        setIsCheckedOut(found && found.checkOut ? true : false);
      } catch (e) {
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
      await postCheckIn(user!.device_id! /* device_id is checked above */, reasonValue);
      // Refresh attendance after check-in
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const pad = (n: number) => n.toString().padStart(2, '0');
      const todayLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const data = await getAttendance(year, month);
      const found = data.find((item: any) => {
        if (item.userId !== user!.id || !item.checkIn) return false;
        const checkInDate = new Date(item.checkIn);
        const checkInLocal = `${checkInDate.getFullYear()}-${pad(checkInDate.getMonth() + 1)}-${pad(checkInDate.getDate())}`;
        return checkInLocal === todayLocal;
      });
      setIsCheckedIn(!!found);
      setDialogOpen(false);
      setReason('');
    } catch (e) {
      // Optionally show error
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
            const minute = now.getMinutes();
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
              const canCheckIn = hour > 6 && hour < 9;
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
      </div>
    </CardField>
  );
};

export default AttendanceCard;