/*
 * This file defines the MeetingRoom component.
 * It renders the main video conferencing interface, including participant list, controls, and speaker layout.
 */

"use client";

import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Loader from "@/components/shared/Loader";
import EndCallButton from "./EndCallButton";

/**
 * Component representing the active meeting room.
 * Manages the display of participants, call controls, and video layout.
 */
export default function MeetingRoom() {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter();
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white bg-[#161925]">
      <div
        className={`
    fixed right-0 top-0 h-screen w-[350px] bg-[#19232d] z-20 p-6
    transform transition-all duration-300 ease-out
    ${
      showParticipants
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0"
    }
      `}
      >
        <CallParticipantsList onClose={() => setShowParticipants(false)} />
      </div>

      <div className="flex h-full w-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <SpeakerLayout participantsBarPosition="left" />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 z-30">
        <CallControls onLeave={() => router.push(`/dashboard`)} />
        <CallStatsButton />
        <button
          type="button"
          onClick={() => setShowParticipants((prev) => !prev)}
        >
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
}
