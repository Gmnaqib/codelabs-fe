import { MdDashboard } from "react-icons/md";
import { IoMdListBox } from "react-icons/io";
import { FaListCheck, FaFingerprint } from "react-icons/fa6";
import { HiOutlineLogout } from "react-icons/hi";
import { RiFileChartFill } from "react-icons/ri";

export const menuItems = [
  {
    title: "Dashboard",
    icon: MdDashboard,
    route: "/",
  },
  {
    title: "Academy",
    icon: IoMdListBox,
    route: "/academy",
  },
  {
    title: "Weekly Report",
    icon: RiFileChartFill,
    route: "/report",
  },
  {
    title: "KPI Scoring",
    icon: FaListCheck,
    route: "/scoring",
  },
  {
    title: "Operasional",
    icon: MdDashboard,
    route: "/operasional",
  },
  {
    title: "Attendance",
    icon: FaFingerprint,
    route: "/attendance",
  },
  {
    title: "Picket Schedule",
    icon: MdDashboard,
    route: "/operasional/picketSchedule",
  },
  {
    title: "Log Out",
    icon: HiOutlineLogout,
    route: "/logout",
  },
];
