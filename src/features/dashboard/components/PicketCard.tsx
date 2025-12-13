"use client";
import React, { useEffect, useState } from "react";
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
import { ArrowUpRightIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";
import { Label } from "@/components/ui/label";

interface PicketPerson {
  name: string;
  userId: string;
}

interface CheckedRecord {
  userId: string;
  recordId: string;
}

const getTodayKey = () => {
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];
};

const getWeekNumber = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstDay.getDay() + 1) / 7);
};

const PicketCard = () => {
  const [picketData, setPicketData] = useState<PicketPerson[]>([]);
  const [checkedRecords, setCheckedRecords] = useState<CheckedRecord[]>([]);

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
          names.map((s) => (s.name === "-" ? { name: "-", userId: "-" } : rotated.shift()!))
        );

        const rec = await getPicketRecords();
        setCheckedRecords(rec.map((r: any) => ({ userId: r.userId, recordId: r._id })));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = async (userId: string) => {
    const existing = checkedRecords.find((rec) => rec.userId === userId);

    try {
      if (existing) {
        await deletePicketRecord(existing.recordId);
        setCheckedRecords((prev) => prev.filter((rec) => rec.userId !== userId));
        toast.success("Picket checklist removed!");
      } else {
        const res = await postPicketRecord({
          userId,
          type: "picket",
          date: new Date().toISOString(),
        });

        setCheckedRecords((prev) => [...prev, { userId, recordId: res.data._id }]);
        toast.success("Picket marked as completed!");
      }
    } catch {
      toast.error("Failed! Please try again.");
    }
  };

  const groups = [
    { title: "Vacuum Cleaner", data: picketData.slice(0, 3) },
    { title: "Table & Research Tool Cleaner", data: picketData.slice(3, 6) },
  ];

  return (
    <CardField title="Picket Schedule Today" icon={<ClipboardDocumentCheckIcon />}>
      <div className="flex flex-col gap-5">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <p className="font-medium text-sm text-center mb-2">{group.title}</p>
            <div className="flex flex-col gap-1">
              {group.data.map((person, index) => (
                <div key={index}  className="w-full flex justify-center">
                  <div className="flex items-center justify-between w-36">
                    <Label htmlFor={`${groupIndex}-${index}`} className="font-base text-sm text-muted text-center">{`${index + 1}. ${person.name.split(" ")[0]}`}</Label>
                    <Checkbox
                      id={`${groupIndex}-${index}`}
                      checked={checkedRecords.some((rec) => rec.userId === person.userId)}
                      onCheckedChange={() => handleCheckboxChange(person.userId)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Link href="/operasional" className="flex text-primary text-base justify-center items-center gap-2">See All Member <ArrowUpRightIcon className="size-4" /></Link>
      </div>
    </CardField>
  );
};

export default PicketCard;
