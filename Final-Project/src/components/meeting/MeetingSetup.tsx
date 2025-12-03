/*
 * This file defines the MeetingSetup component.
 * It allows users to configure their audio and video settings before joining a meeting.
 */

"use client";

import {
  DeviceSettings,
  useCall,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { CalendarClock, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReturnToMenuDisplay from "@/components/shared/ReturnToMenuDisplay";
import Navbar from "../shared/Navbar";

/**
 * Component for setting up meeting preferences.
 * Handles device preview, microphone/camera toggling, and joining the call.
 *
 * @param setIsSetupComplete - Function to update the setup completion state.
 */
export default function MeetingSetup({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;
  const [isJoining, setIsJoining] = useState(false);

  const call = useCall();

  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component.",
    );
  }

  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  if (callTimeNotArrived)
    return (
      <ReturnToMenuDisplay
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
        Icon={CalendarClock}
      />
    );

  if (callHasEnded)
    return (
      <ReturnToMenuDisplay
        title="The call has been ended by the host"
        Icon={PhoneOff}
      />
    );

  const handleJoin = () => {
    if (isJoining) return;

    setIsJoining(true);

    try {
      call.join();
      setIsSetupComplete(true);
      setIsJoining(false);
    } catch {
      toast.error("Failed to schedule meeting");
      setIsJoining(false);
    }
  };

  return (
    <div>
      <Navbar showHamburgerMenu={false} />
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-black">
        <h1 className="text-center text-2xl mb-12">Call Setup</h1>
        <div className="w-11/12 max-w-2xl min-h-[300px] md:min-h-[400px] flex items-center justify-center">
          <VideoPreview />
        </div>
        <div className="flex h-16 items-center justify-center gap-3 text-black">
          <label className="flex items-center justify-center gap-2">
            <input
              type="checkbox"
              checked={isMicCamToggled}
              onChange={(e) => setIsMicCamToggled(e.target.checked)}
            />
            Join with mic and camera off
          </label>
          <div className="device-settings-override text-white">
            <DeviceSettings />
          </div>
        </div>
        <button
          type="button"
          disabled={isJoining}
          className={`text-center py-3 text-white rounded-md p-2 
                ${
                  isJoining
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                }`}
          onClick={handleJoin}
        >
          {isJoining ? "Joining..." : "Join meeting"}
        </button>
      </div>
    </div>
  );
}
