import React from "react";

type ThematicRecord = {
  date: string | Date;
};

type ThematicUser = {
  operationalRecords?: ThematicRecord[];
};

const renderThematicCell = (
  day: string | number,
  rowIndex: number,
  data: ThematicUser[],
) => {
  const user = data[rowIndex];
  const ops: ThematicRecord[] = user?.operationalRecords || [];

  const now = new Date();

  const cellDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    Number(day)
  );

  const thematicEndTime = new Date(cellDate);
  thematicEndTime.setHours(17, 30, 0, 0);

  let status: "Thematic" | "No Thematic" | "Not Yet Thematic";

  if (cellDate > now) {
    status = "Not Yet Thematic";
  }
  else if (
    cellDate.toDateString() === now.toDateString() &&
    now < thematicEndTime
  ) {
    status = "Not Yet Thematic";
  }
  else {
    const record = ops.find(
      (r) => {
        const d = new Date(r.date);
        return d.getUTCDate() === Number(day) &&
          d.getUTCMonth() === now.getUTCMonth() &&
          d.getUTCFullYear() === now.getUTCFullYear();
      }
    );
    status = record ? "Thematic" : "No Thematic";
  }

  return (
    <div>
      <p  className={"px-4 py-1 text-xs rounded-lg " + (status === "Thematic" ? "text-success bg-bg-success" : status === "No Thematic" ? "text-destructive bg-bg-destructive" : "text-neutral bg-bg-neutral")}>{status}</p>
    </div>
  );
};

export default renderThematicCell;
