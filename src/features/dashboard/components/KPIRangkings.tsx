import React, { useState } from "react"
import SelectField from "@/components/custom-ui/SelectField"
import { DataSelectRangkingsKPI } from "@/config/dashboard"
import { resolveImageUrl } from "@/lib/utils"
import { useKpiRankingsCard } from "@/features/dashboard/hooks"

const KPIRangkings = () => {
  const [filter, setFilter] = useState("highest")
  const { users, loading } = useKpiRankingsCard();

  const sortedUsers = [...users].sort((a, b) => {
    return filter === "highest"
      ? b.totalPoints - a.totalPoints
      : a.totalPoints - b.totalPoints
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="font-medium">KPI Rangkings</p>
        <SelectField
          options={DataSelectRangkingsKPI}
          value={filter}
          onChange={(value) => setFilter(value)}

        />
      </div>

      <div className="max-h-80 overflow-y-auto flex flex-col gap-4 scrollbar-none ">
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!loading && sortedUsers.map((user, index) => (
          <div key={user.name + '-' + user.totalPoints + '-' + index} className="flex w-full gap-3 items-center border-b pb-2">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(user.image)}
                alt="profile"
                height={50}
                width={50}
                className="rounded-full object-cover"
              />
              <div className="absolute flex justify-center items-center top-0 right-0 -mr-1.5 bg-[#2080D9] w-5 h-5 rounded-full">
                <p className="text-xs text-white font-semibold">
                  {filter === "highest" ? index + 1 : sortedUsers.length - index}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center w-full">
              <p className="text-base">{user.name.split(" ")[0]}</p>
              <p className="font-normal text-primary text-base">{user.totalPoints}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default KPIRangkings
