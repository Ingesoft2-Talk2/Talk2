"use client";

import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
import ScheduleMeetingSuccessModal from "./ScheduleMeetingSuccessModal";

export default function ScheduleMeeting() {
  const [scheduleMeetingModalOpen, setScheduleMeetingModalOpen] =
    useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const handleMeetingScheduled = (callId: string) => {
    setScheduleMeetingModalOpen(false);
    setMeetingLink(`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callId}`);
    setSuccessModalOpen(true);
  };

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
          onSuccess={handleMeetingScheduled}
        />
      )}

      {successModalOpen && (
        <ScheduleMeetingSuccessModal
          isOpen={successModalOpen}
          link={meetingLink}
          handleClose={() => setSuccessModalOpen(false)}
        />
      )}
    </div>
  );
}
