"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CardField from "@/components/custom-ui/CardField";
import { getPicketSchedules } from "@/services/schedule/scheduleService";
import { Label } from "@/components/ui/label";
import { PicketPerson } from "@/types/PicketPersonProps";
import { ArrowUpRightIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";

const PicketCard = () => {
  const [picketData, setPicketData] = useState<PicketPerson[]>([]);

  const getTodayKey = () => {
    return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];
  };

  const getWeekNumber = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getPicketSchedules();
      const today = getTodayKey();

      const schedule = res?.data?.[0]?.days?.[today] ?? [];
      const names: PicketPerson[] = schedule.map((s: any) => ({
        name: s.userName,
        userId: s.userId,
      }));

      const week = getWeekNumber(new Date());
      const validNames = names.filter((n) => n.name !== "-");

      const rotated = validNames
        .slice(week % validNames.length)
        .concat(validNames.slice(0, week % validNames.length));

      setPicketData(
        names.map((s) =>
          s.name === "-" ? { name: "-", userId: "-" } : rotated.shift()!
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, []);


  const groups = [
    { title: "Vacuum Cleaner", data: picketData.slice(0, 3) },
    { title: "Table & Research Tool Cleaner", data: picketData.slice(3, 6) },
  ];

  return (
    <CardField title="Picket Schedule Today" icon={<ClipboardDocumentCheckIcon />} bg>
      <div className="flex flex-col gap-5">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <p className="font-medium text-sm text-center mb-2">{group.title}</p>
            <div className="flex flex-col gap-1">
              {group.data.map((person, index) => (
                <div key={index}  className="w-full flex justify-center">
                  <Label htmlFor={`${groupIndex}-${index}`} className="font-base text-sm text-muted text-center">{`${index + 1}. ${person.name.split(" ")[0]}`}</Label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Link href="/operasional" className="flex text-primary text-base justify-center items-center gap-2">See Map <ArrowUpRightIcon className="size-4" /></Link>
      </div>
    </CardField>
  );
};

export default PicketCard;
