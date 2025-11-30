import {
  BookUser,
  Calendar,
  History,
  LayoutDashboard,
  UserPlus,
  Video,
} from "lucide-react";

export const sidebarLinks = [
  {
    icon: LayoutDashboard,
    route: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: BookUser,
    route: "/friends",
    label: "Friends",
  },
  {
    icon: Calendar,
    route: "/upcoming",
    label: "Upcoming",
  },
  {
    icon: History,
    route: "/previous",
    label: "Previous",
  },
  {
    icon: Video,
    route: "/recordings",
    label: "Recordings",
  },
  {
    icon: UserPlus,
    route: "/personal-room",
    label: "Personal Room",
  },
];
