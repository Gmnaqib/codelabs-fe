"use client";
import React, { useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import Link from "next/link";
import CardField from "@/components/custom-ui/CardField";
import { getPicketSchedules } from "@/services/schedule/scheduleService";
import { Checkbox } from "@/components/ui/checkbox";

const PicketCard = () => {
  const [picketData, setPicketData] = useState<string[]>([]);

  const getTodayKey = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date().getDay()];
  };

  const getWeekNumber = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
  };

  useEffect(() => {
    const fetchPicket = async () => {
      try {
        const res = await getPicketSchedules();
        const today = getTodayKey();
        const schedule = res.data[0]?.days?.[today] || [];

        let names = schedule.map((s: any) => s.userName);

        const week = getWeekNumber(new Date());
        const validNames = names.filter((n:any) => n !== "-");
        const rotated = validNames
          .slice(week % validNames.length)
          .concat(validNames.slice(0, week % validNames.length));

        const final = names.map((n:any) =>
          n === "-" ? "-" : rotated.shift() || "-"
        );

        setPicketData(final);
      } catch (err) {
        console.error("Failed to fetch picket schedule:", err);
      }
    };

    fetchPicket();
  }, []);

  const vacuumCleaner = picketData.slice(0, 3);
  const tableCleaner = picketData.slice(3, 6);

  return (
    <CardField title="Picket Schedule Today" icon={<IoIosWarning size={22} />}>
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-lg">Vacuum Cleaner</p>
        <div className="flex flex-col gap-3">
          {vacuumCleaner.map((name, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 justify-between"
            >
              <label
                htmlFor={`vacuum-${index}`}
                className="text-base font-normal"
              >
                {name}
              </label>
              <Checkbox id={`vacuum-${index}`} />
            </div>
          ))}
        </div>

        <p className="font-semibold text-lg">
          Table Cleaner & Research Tool Cleaner
        </p>
        <div className="flex flex-col gap-3">
          {tableCleaner.map((name, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 justify-between"
            >
              <label
                htmlFor={`table-${index}`}
                className="text-base font-normal"
              >
                {name}
              </label>
              <Checkbox id={`table-${index}`} />
            </div>
          ))}
        </div>

        <p className="text-sm text-center mt-2">
          If someone is not picket, please contact the Ministry of Operations{" "}
          <span className="font-semibold text-[#2080D9]">
            <Link href="https://t.me/Erwinhafizz">Erwin</Link>
          </span>{" "}
          to be given a fine.
        </p>
      </div>
    </CardField>
  );
};

export default PicketCard;
