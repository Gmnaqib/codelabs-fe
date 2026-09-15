"use client";
import React from "react";
import CardField from "@/components/custom-ui/CardField";
import { Label } from "@/components/ui/label";
import { TagIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useThematicCard } from "@/features/dashboard/hooks";
import { useAuth } from "@/features/auth/hooks";

const SCHEDULE_PAGE_ROLES = ["admin", "minister of operation"];

const ThematicCard = () => {
  const { topic, assignedUsers } = useThematicCard();
  const { user } = useAuth();
  const canViewSchedule = !!user?.role && SCHEDULE_PAGE_ROLES.includes(user.role);

  return (
    <CardField title="Thematic Schedule Today" icon={<TagIcon />} bg>
      <div className="flex flex-col gap-5 flex-1 justify-between">
        {topic ? (
          <div className="flex flex-col gap-3">
            <div className="w-full flex justify-center">
              <span className="rounded-full bg-primary/10 text-primary text-sm font-medium px-3 py-1">
                {topic}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {assignedUsers.map((person, index) => (
                <div key={person._id} className="w-full flex justify-center">
                  <Label className="font-base text-sm text-muted text-center">
                    {`${index + 1}. ${person.name.split(" ")[0]}`}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted text-center">No thematic scheduled today.</p>
        )}

        {canViewSchedule && (
          <Link href="/schedule" className="text-primary text-base text-center">
            See Schedule
          </Link>
        )}
      </div>
    </CardField>
  );
};

export default ThematicCard;
