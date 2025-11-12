"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import DashboardCard from "./DashboardCard";
import NewMeetingModal from "./NewMeetingModal";

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
