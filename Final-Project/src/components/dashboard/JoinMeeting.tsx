/*
 * This file defines the JoinMeeting component.
 * It renders a dashboard card that opens a modal to join a meeting via a link.
 */

"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import JoinMeetingModal from "./JoinMeetingModal";

/**
 * Component for the "Join Meeting" action on the dashboard.
 * Manages the state of the join meeting modal.
 */
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
