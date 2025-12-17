import { useEffect, useMemo, useState } from "react";

export function useClock(timeZone = "Asia/Jakarta") {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [timeZone]
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [timeZone]
  );

  return {
    time,
    formattedTime: timeFormatter.format(time),
    formattedDate: dateFormatter.format(time),
  };
}
