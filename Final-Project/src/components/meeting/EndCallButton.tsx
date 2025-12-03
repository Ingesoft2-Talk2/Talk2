/*
 * This file defines the EndCallButton component.
 * It allows the meeting owner to end the call for everyone.
 */

"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

/**
 * Button component to end the call for all participants.
 * Visible only to the meeting owner.
 */
export default function EndCallButton() {
  const call = useCall();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  if (!call)
    throw new Error(
      "useStreamCall must be used within a StreamCall component.",
    );

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    if (isNavigating) return;

    setIsNavigating(true);

    try {
      await call.endCall();
      router.push("/dashboard");
    } catch {
      toast.error("Failed to end meeting");
      setIsNavigating(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isNavigating}
      className={
        "text-center  text-white rounded-md p-2 cursor-pointer bg-red-500 hover:bg-red-700"
      }
      onClick={endCall}
    >
      {isNavigating ? "Ending meeting..." : "End call for everyone"}
    </button>
  );
}
