/*
 * This file defines the NewMeetingModal component.
 * It provides a modal for users to start an instant meeting.
 */

"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
import ReactPortal from "@/components/shared/ReactPortal";

type NewMeetingModal = {
  isOpen: boolean;
  handleClose: () => void;
};

/**
 * Modal component for creating an instant meeting.
 * Initializes a new call with Stream Video and redirects the user to the meeting room.
 *
 * @param props - The properties for the new meeting modal.
 */
export default function NewMeetingModal({
  isOpen,
  handleClose,
}: NewMeetingModal) {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();
  const client = useStreamVideoClient();
  const router = useRouter();

  if (!isOpen) return null;

  const createInstantMeeting = async () => {
    if (isCreating) return;

    setIsCreating(true);

    if (!client || !user) {
      toast.error("User or client not available");
      setIsCreating(false);
      return;
    }

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create meeting");

      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: { description: "Instant Meeting" },
        },
      });

      router.push(`/meeting/${call.id}`);
      toast.success("Meeting Created");
    } catch {
      toast.error("Failed to create Meeting");
      setIsCreating(false);
    }
  };

  if (!client || !user) return <Loader text="Getting your user..." />;

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-2xl">
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
            <h1 className="text-3xl font-bold leading-[42px] flex justify-center">
              Start an Instant Meeting
            </h1>
            <button
              type="button"
              disabled={isCreating}
              className={`rounded-md p-2 text-white
                ${isCreating
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                }`}
              onClick={createInstantMeeting}
            >
              {isCreating ? "Creating..." : "Start Meeting"}
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
