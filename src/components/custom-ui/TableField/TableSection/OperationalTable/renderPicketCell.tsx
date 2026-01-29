import React from "react";

const renderPicketCell = (
  day: string | number,
  rowIndex: number,
  data: any[]
) => {
  const user = data[rowIndex];
  const ops = user?.operationalRecords || [];

  const now = new Date();
  const cellDate = new Date(now.getFullYear(), now.getMonth(), Number(day));

  const record = ops.find((r: any) => {
    const d = new Date(r.date);
    return (
      d.getFullYear() === cellDate.getFullYear() &&
      d.getMonth() === cellDate.getMonth() &&
      d.getDate() === cellDate.getDate()
    );
  });

  const picketEndTime = new Date(cellDate);
  picketEndTime.setHours(17, 30, 0, 0);

  let status: "Picket" | "No Picket" | "Not Yet Picket";

  if (cellDate > now) {
    status = "Not Yet Picket";
  } else if (
    cellDate.toDateString() === now.toDateString() &&
    now < picketEndTime
  ) {
    status = "Not Yet Picket";
  } else {
    status = record ? "Picket" : "No Picket";
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
