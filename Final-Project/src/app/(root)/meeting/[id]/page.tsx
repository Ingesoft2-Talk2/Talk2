"use client";

import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { SearchX, UserRoundX } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import MeetingRoom from "@/components/meeting/MeetingRoom";
import MeetingSetup from "@/components/meeting/MeetingSetup";
import Loader from "@/components/shared/Loader";
import ReturnToMenuDisplay from "@/components/shared/ReturnToMenuDisplay";
import { useGetCallById } from "@/hooks/useGetCallById";

export default function PreMeetingPage() {
  const { id } = useParams<{ id: string }>();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading)
    return <Loader text="Setting up your meeting..." />;

  if (!call)
    return <ReturnToMenuDisplay title="Call Not Found" Icon={SearchX} />;

  const notAllowed =
    call.type === "invited" &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed)
    return (
      <ReturnToMenuDisplay
        title="You are not allowed to join this meeting"
        Icon={UserRoundX}
      />
    );

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}
