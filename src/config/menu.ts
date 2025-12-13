import { MdDashboard } from "react-icons/md";
import { FaListCheck, FaFingerprint, FaCamera, FaTrophy, FaRobot, FaBook } from "react-icons/fa6";
import { HiOutlineLogout } from "react-icons/hi";
import { RiFileChartFill } from "react-icons/ri";
import { IoIosPeople } from "react-icons/io";

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
    icon: FaBook,
    route: "/assessments",
  },
  {
    title: "Members",
    icon: IoIosPeople,
    route: "/members",
  },
  {
    title: "Resarch & Tech",
    icon: FaRobot,
    route: "/ristek",
  },
  {
    title: "Competition",
    icon: FaTrophy,
    route: "/competition",
  },
  {
    title: "Branding",
    icon: FaCamera,
    route: "/branding",
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
