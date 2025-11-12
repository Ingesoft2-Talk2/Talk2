import {
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
