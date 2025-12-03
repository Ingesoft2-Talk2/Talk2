/*
 * This file defines static links used in the application's sidebar.
 * It maps routes to their corresponding icons and labels.
 */

import {
  BookUser,
  Calendar,
  History,
  LayoutDashboard,
  UserPlus,
  Video,
} from "lucide-react";

/**
 * Array of sidebar link objects.
 * Each object contains an icon, a route path, and a display label.
 */
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
