"use client";

import {
  DeviceSettings,
  useCall,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { CalendarClock, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import ReturnToMenuDisplay from "@/components/shared/ReturnToMenuDisplay";
import Navbar from "../shared/Navbar";

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
          className=" text-center py-3 bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-md p-2 cursor-pointer hover:bg-blue-700 border-none"
          onClick={() => {
            call.join();
            setIsSetupComplete(true);
          }}
        >
          Join meeting
        </button>
      </div>
    </div>
  );
}
