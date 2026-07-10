"use client";
import React from "react";
import dynamic from "next/dynamic";
import CardField from "@/components/custom-ui/CardField";
import { Label } from "@/components/ui/label";
import { ArrowUpRightIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";
import { PicketCardProps } from "@/types/PicketCardProps";
import { usePicketCard } from "@/features/dashboard/hooks";

const PicketMapCanvas = dynamic(() => import("./PicketMapCanvas"), { ssr: false });

const PicketCard = ({ showMap, setShowMap }: PicketCardProps) => {
  const { picketData } = usePicketCard();

  const groups = [
    { title: "Vacuum Cleaner", data: picketData.slice(0, 3) },
    { title: "Table & Research Tool Cleaner", data: picketData.slice(3, 6) },
  ];

  return (
    <CardField title="Picket Schedule Today" icon={<ClipboardDocumentCheckIcon />} bg>
      <div className="flex flex-col gap-5 flex-1 justify-between">
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
        </div>

        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="flex text-primary text-base justify-center items-center gap-2 border-none bg-transparent cursor-pointer"
        >
          See Map <ArrowUpRightIcon className="text-primary text-base font-normal size-4" />
        </button>

        {showMap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-40 lg:top-4 right-4 bg-white rounded-lg px-2 py-1 text-gray-500 hover:text-red-500 text-xl font-bold z-50"
              aria-label="Close"
            >
              ×
            </button>
            <div className="w-screen h-screen flex flex-col">
              <div className="flex-1">
                <PicketMapCanvas />
              </div>
            </div>
          </div>
        )}
      </div>
    </CardField>
  );
};

export default PicketCard;
