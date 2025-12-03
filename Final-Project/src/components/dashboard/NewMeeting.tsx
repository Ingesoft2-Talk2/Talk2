/*
 * This file defines the NewMeeting component.
 * It renders a dashboard card that opens a modal to create a new instant meeting.
 */

"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import NewMeetingModal from "./NewMeetingModal";

/**
 * Component for the "New Meeting" action on the dashboard.
 * Manages the state of the new meeting modal.
 */
export default function NewMeeting() {
  const [newMeetingModalOpen, setNewMeetingModalOpen] = useState(false);

  return (
    <div>
      <DashboardCard
        color="bg-orange-300"
        Icon={Plus}
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setNewMeetingModalOpen(true)}
      />
      {newMeetingModalOpen && (
        <NewMeetingModal
          isOpen={newMeetingModalOpen}
          handleClose={() => setNewMeetingModalOpen(false)}
        />
      )}
    </div>
  );
}
