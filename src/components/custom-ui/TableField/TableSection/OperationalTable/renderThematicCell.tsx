import React from "react";

const renderThematicCell = (
  day: string | number,
  rowIndex: number,
  data: any[],
) => {
  const user = data[rowIndex];
  const ops = user?.operationalRecords || [];

  const record = ops.find(
    (r: any) => new Date(r.date).getDate() === Number(day)
  );

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
    status = record ? "Thematic" : "No Thematic";
  }

  return (
    <div>
      <p  className={"px-4 py-1 text-xs rounded-lg " + (status === "Thematic" ? "text-success bg-bg-success" : status === "No Thematic" ? "text-destructive bg-bg-destructive" : "text-neutral bg-bg-neutral")}>{status}</p>
    </div>
  );
};

export default renderThematicCell;
