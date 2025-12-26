import { CheckCircleIcon, ExclamationCircleIcon, MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

export const renderAbsenceCell = (
  day: string | number,
  rowIndex: number,
  data: any[],
) => {
  const user = data[rowIndex];
  const record = user?.records?.find(
    (r: any) => new Date(r.date).getDate() === Number(day)
  );
  
  if (!record)
    return <MinusCircleIcon className="size-6 text-neutral" />;
  if (record.checkIn && record.checkOut)
    return <CheckCircleIcon className="size-6 text-primary"/>
  if (record.status === "leave")
    return <PlusCircleIcon className="size-6 text-success"/>
  if (record.status === "sick")
    return <ExclamationCircleIcon className="size-6 text-warning"/>

};

export default renderAbsenceCell;
