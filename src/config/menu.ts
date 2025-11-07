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
    title: "Assessments",
    icon: FaFingerprint,
    route: "/assessments",
  },
  {
    title: "Members",
    icon: FaFingerprint,
    route: "/members",
  },
  {
    title: "Log Out",
    icon: HiOutlineLogout,
    route: "/logout",
  },
];

export const menuNavbar = [
  { path: '/dashboard', title: 'Home' },
  { path: '/academy', title: 'Academy' },
  { path: '/report', title: 'Weekly Report' },
  { path: '/scoring', title: 'KPI Scoring' },
  { path: '/operasional', title: 'Operasional' },
  { path: '/attendance', title: 'Attendance' },
  { path: '/operasional/picketSchedule', title: 'Picket Schedule' },
  { path: '/profile', title: 'Profile' },
]
