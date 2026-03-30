import React from "react";

type OperationalRecord = {
  date: string | Date;
};


type AssignedUser = {
  nim?: string | number;
  _id?: string;
  name?: string;
};

type PicketUser = {
  operationalRecords?: OperationalRecord[];
  nim?: string | number;
  _id?: string;
};


type PicketSchedule = {
  _id: string;
  date: string;
  description?: string;
  assignedUsers?: AssignedUser[];
};

const renderPicketCell = (
  day: string | number,
  rowIndex: number,
  data: PicketUser[],
  picketSchedules?: PicketSchedule[]
) => {
  // Always log picketSchedules for debugging
  console.log("PICKET SCHEDULES (cell):", picketSchedules);

  const user = data[rowIndex];
  const ops: OperationalRecord[] = user?.operationalRecords || [];

  const now = new Date();
  const cellDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), Number(day)));

  const record = ops.find((r) => {
    const d = new Date(r.date);
    return (
      d.getUTCFullYear() === cellDate.getUTCFullYear() &&
      d.getUTCMonth() === cellDate.getUTCMonth() &&
      d.getUTCDate() === cellDate.getUTCDate()
    );
  });

  const picketEndTime = new Date(cellDate);
  picketEndTime.setHours(20, 0, 0, 0);


  let status: "Picket" | "No Picket" | "Not Yet Picket";

  // Find if user is scheduled for picket on this date
  let isScheduled = false;
  if (Array.isArray(picketSchedules)) {
    // Flatten all schedules for the day
    const cellDateStr = cellDate.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    isScheduled = picketSchedules.some((schedule) => {
      // schedule.date could be string or Date
      const scheduleDateStr = (typeof schedule.date === 'string' ? schedule.date : new Date(schedule.date).toISOString()).slice(0, 10);
      if (scheduleDateStr !== cellDateStr) return false;
      // assignedUsers is array of user objects with nim or _id
      if (!Array.isArray(schedule.assignedUsers)) return false;
      // Try to match by nim or _id
      return schedule.assignedUsers.some((u: AssignedUser) => {
        // user.nim could be string or number
        return (u.nim && user.nim && String(u.nim) === String(user.nim)) || (u._id && user._id && String(u._id) === String(user._id));
      });
    });
  }

  // Logic for future and today (before 17:00)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const cellDateOnly = new Date(cellDate);
  cellDateOnly.setUTCHours(0, 0, 0, 0);

  // If cellDate is in the future
  if (cellDateOnly > today) {
    status = "Not Yet Picket";
  } else if (cellDateOnly.getTime() === today.getTime()) {
    // If today, check time
    const nowHour = now.getHours();
    if (nowHour < 17) {
      status = "Not Yet Picket";
    } else {
      // After 17:00, use picket logic
      if (!isScheduled) {
        status = "Not Yet Picket";
      } else if (!record) {
        status = "No Picket";
      } else {
        status = "Picket";
      }
    }
  } else {
    // Past days, use picket logic
    if (!isScheduled) {
      status = "Not Yet Picket";
    } else if (!record) {
      status = "No Picket";
    } else {
      status = "Picket";
    }
  }

  return (
    <div>
      <p
        className={
          "px-4 py-1 text-xs rounded-lg " +
          (status === "Picket"
            ? "text-success bg-bg-success"
            : status === "No Picket"
            ? "text-destructive bg-bg-destructive"
            : "text-neutral bg-bg-neutral")
        }
      >
        {status}
      </p>
    </div>
  );
};

export default renderPicketCell;
