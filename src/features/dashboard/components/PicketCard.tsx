"use client";
import React, { useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import Link from "next/link";
import CardField from "@/components/custom-ui/CardField";
import {
  getPicketRecords,
  getPicketSchedules,
  postPicketRecord,
  deletePicketRecord,
} from "@/services/schedule/scheduleService";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface PicketPerson {
  name: string;
  userId: string;
}

interface CheckedRecord {
  userId: string;
  recordId: string;
}

const PicketCard = () => {
  const [picketData, setPicketData] = useState<PicketPerson[]>([]);
  const [checkedRecords, setCheckedRecords] = useState<CheckedRecord[]>([]);

  // Convert current day ke key field API
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
    const fetchData = async () => {
      try {
        // ⭐ GET schedule piket (rotated)
        const res = await getPicketSchedules();
        const today = getTodayKey();
        const schedule = res.data[0]?.days?.[today] || [];

        let names = schedule.map((s: any) => ({
          name: s.userName,
          userId: s.userId,
        }));

        const week = getWeekNumber(new Date());
        const validNames = names.filter((n: any) => n.name !== "-");
        const rotated = validNames
          .slice(week % validNames.length)
          .concat(validNames.slice(0, week % validNames.length));

        const final = names.map((s: any) =>
          s.name === "-" ? { name: "-", userId: "-" } : rotated.shift()!
        );

        setPicketData(final);

        // ⭐ GET record checklist (userId & recordId)
        const rec = await getPicketRecords();
        const checked = rec.map((r: any) => ({
          userId: r.userId,
          recordId: r._id,
        }));

        setCheckedRecords(checked);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const vacuumCleaner = picketData.slice(0, 3);
  const tableCleaner = picketData.slice(3, 6);

  // ⭐ Ketika checkbox diclick
  const handleCheckboxChange = async (userId: string) => {
  const existing = checkedRecords.find((rec) => rec.userId === userId);

  try {
    if (existing) {
      // ✅ UNCHECK → DELETE record
      await deletePicketRecord(existing.recordId);
      setCheckedRecords((prev) => prev.filter((rec) => rec.userId !== userId));

      toast.success("Picket checklist removed!");
    } else {
      // ✅ CHECK → POST record
      const res = await postPicketRecord({
        userId,
        type: "picket",
        date: new Date().toISOString(),
      });

      setCheckedRecords((prev) => [
        ...prev,
        { userId, recordId: res.data._id },
      ]);

      toast.success("Picket marked as completed!");
    }
  } catch (error) {
    console.error("Failed to update record:", error);

    toast.error("Failed! Please try again.");
  }
};


  return (
    <CardField title="Picket Schedule Today" icon={<IoIosWarning size={22} />}>
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-lg">Vacuum Cleaner</p>

        <div className="flex flex-col gap-3">
          {vacuumCleaner.map((person, index) => (
            <div key={index} className="flex items-center space-x-2 justify-between">
              <label htmlFor={`vacuum-${index}`} className="text-base font-normal">
                {person.name}
              </label>
              <Checkbox
                id={`vacuum-${index}`}
                checked={checkedRecords.some((rec) => rec.userId === person.userId)}
                onCheckedChange={() => handleCheckboxChange(person.userId)}
              />
            </div>
          ))}
        </div>

        <p className="font-semibold text-lg">
          Table Cleaner & Research Tool Cleaner
        </p>

        <div className="flex flex-col gap-3">
          {tableCleaner.map((person, index) => (
            <div key={index} className="flex items-center space-x-2 justify-between">
              <label htmlFor={`table-${index}`} className="text-base font-normal">
                {person.name}
              </label>
              <Checkbox
                id={`table-${index}`}
                checked={checkedRecords.some((rec) => rec.userId === person.userId)}
                onCheckedChange={() => handleCheckboxChange(person.userId)}
              />
            </div>
          ))}
        </div>

        <p className="text-sm text-center mt-2">
          If someone is not picket, please contact Ops Ministry{" "}
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
