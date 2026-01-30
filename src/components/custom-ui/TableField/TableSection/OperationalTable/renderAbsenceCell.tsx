import { CheckCircleIcon, ExclamationCircleIcon, MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";


type AbsenceRecord = {
  userId: string;
  start_date?: string | Date;
  end_date?: string | Date;
  checkIn?: string | Date;
  checkOut?: string | Date;
  createdAt?: string | Date;
  status?: string;
  approval_status?: string;
};

export const renderAbsenceCell = (
  day: number,
  userId: string,
  data: AbsenceRecord[],
) => {

  // Cek jika hari Minggu, jangan render icon apapun
  let month = undefined;
  let year = undefined;
  if (data && data.length > 0) {
    const d = data[0].start_date ? new Date(data[0].start_date) : (data[0].checkIn ? new Date(data[0].checkIn) : (data[0].createdAt ? new Date(data[0].createdAt) : new Date()));
    month = d.getMonth();
    year = d.getFullYear();
  } else {
    const now = new Date();
    month = now.getMonth();
    year = now.getFullYear();
  }
  // Buat tanggal dari hari, bulan, tahun
  const currentDate = new Date(year, month, day);
  if (currentDate.getDay() === 0) {
    return null;
  }
  // Jangan render icon untuk tanggal di masa depan KECUALI jika ada izin/sakit yang sudah approved
  const today = new Date();
  today.setHours(0,0,0,0);
  // ...existing code...

  const record = data.find((r) => {
    if (r.userId !== userId) return false;
    const start = r.start_date ? new Date(r.start_date) : (r.checkIn ? new Date(r.checkIn) : (r.createdAt ? new Date(r.createdAt) : null));
    const end = r.end_date ? new Date(r.end_date) : start;
    if (!start || !end) return false;

    if ((r.status === "sick" || r.status === "permit") && r.start_date && r.end_date) {
      const current = new Date(start);
      current.setDate(day);
      return current >= start && current <= end;
    }
    return (
      start.getDate() === day &&
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    );
  });

  if (!record) {
    return <MinusCircleIcon className="size-6 text-neutral" />;
  }

  if (record.checkIn && record.checkOut) {
    return <CheckCircleIcon className="size-6 text-primary" />;
  }

  if ((record.status === "sick")) {
    if (record.approval_status === "approved") {
      return <PlusCircleIcon className="size-6 text-success" />;
    }
    if (record.approval_status === "rejected") {
      return <MinusCircleIcon className="size-6 text-neutral" />;
    }
  }

   if (( record.status === "permit")) {
    if (record.approval_status === "approved") {
      return <ExclamationCircleIcon className="size-6 text-warning" />;
    }
    if (record.approval_status === "rejected") {
      return <MinusCircleIcon className="size-6 text-neutral" />;
    }
  }

  if (record.status === "present" && (!record.checkIn || !record.checkOut)) {
    return <MinusCircleIcon className="size-6 text-neutral" />;
  }

  return <MinusCircleIcon className="size-6 text-neutral" />;
};

export default renderAbsenceCell;

