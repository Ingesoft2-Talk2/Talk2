"use client";

import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import ScheduleMeetingModal from "./ScheduleMeetingModal";

export default function ScheduleMeeting() {
  const [scheduleMeetingModalOpen, setScheduleMeetingModalOpen] =
    useState(false);

  return (
    <div>
      <DashboardCard
        color="bg-violet-300"
        Icon={CalendarPlus}
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setScheduleMeetingModalOpen(true)}
      />
      {scheduleMeetingModalOpen && (
        <ScheduleMeetingModal
          isOpen={scheduleMeetingModalOpen}
          handleClose={() => setScheduleMeetingModalOpen(false)}
        />
      )}
    </div>
  );
}
