/*
 * This file defines the ScheduleMeetingModal component.
 * It provides a form for users to schedule a meeting with a description and date/time.
 */

"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
import ReactPortal from "@/components/shared/ReactPortal";

type ScheduleMeetingModal = {
  isOpen: boolean;
  handleClose: () => void;
  onSuccess: (callId: string) => void;
};

/**
 * Modal component for scheduling a meeting.
 * Collects meeting details and creates a scheduled call via Stream Video.
 *
 * @param props - The properties for the schedule meeting modal.
 */
export default function ScheduleMeetingModal({
  isOpen,
  handleClose,
  onSuccess,
}: ScheduleMeetingModal) {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const createScheduledMeeting = async () => {
    if (isCreating) return;

    setIsCreating(true);

    if (!client || !user) {
      toast.error("User or client not available");
      setIsCreating(false);
      return;
    }

    try {
      if (!description) {
        toast.error("Please create a description");
        setIsCreating(false);
        return;
      }
      if (!dateTime) {
        toast.error("Please select a date and time");
        setIsCreating(false);
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to schedule meeting");

      await call.getOrCreate({
        data: {
          starts_at: new Date(dateTime).toISOString(),
          custom: { description: description },
        },
      });

      onSuccess(call.id);
      toast.success("Meeting Scheduled");
      setIsCreating(false);
    } catch {
      toast.error("Failed to schedule meeting");
      setIsCreating(false);
    }
  };

  if (!client || !user) return <Loader text="Getting your user..." />;
  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="text-gray-500 hover:text-black cursor-pointer"
              onClick={handleClose}
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-6 text-black">
            <h1 className="text-3xl font-bold leading-[42px]">
              Create Meeting
            </h1>
            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="meeting-description"
                className="text-base font-normal leading-[22.4px] text-sky-2"
              >
                Add a description
              </label>
              <textarea
                id="meeting-description"
                data-testid="schedule-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-200 rounded-md p-2 max-h-40 resize-y min-h-24 focus:outline-none"
              />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <label
                htmlFor="meeting-datetime"
                className="text-base font-normal leading-[22.4px] text-sky-2"
              >
                Select Date and Time
              </label>
              <input
                id="meeting-datetime"
                data-testid="schedule-datetime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full rounded bg-dark-3 p-2 focus:outline-none bg-gray-200"
              />
            </div>
            <button
              type="button"
              data-testid="schedule-submit-btn"
              disabled={isCreating}
              className={`rounded-md p-2 text-white
                ${
                  isCreating
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                }`}
              onClick={createScheduledMeeting}
            >
              {isCreating ? "Creating..." : "Schedule Meeting"}
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
