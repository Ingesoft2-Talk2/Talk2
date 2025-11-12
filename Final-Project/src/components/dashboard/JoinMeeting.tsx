"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import JoinMeetingModal from "./JoinMeetingModal";

export default function JoinMeeting() {
  const [joinMeetingModalOpen, setJoinMeetingModalOpen] = useState(false);

  return (
    <div>
      <DashboardCard
        color="bg-green-300"
        Icon={UserPlus}
        title="Join Meeting"
        description="via invitation link"
        handleClick={() => setJoinMeetingModalOpen(true)}
      />
      {joinMeetingModalOpen && (
        <JoinMeetingModal
          isOpen={joinMeetingModalOpen}
          handleClose={() => setJoinMeetingModalOpen(false)}
        />
      )}
    </div>
  );
}
