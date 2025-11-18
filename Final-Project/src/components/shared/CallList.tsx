"use client";

import type { Call, CallRecording } from "@stream-io/video-react-sdk";
import {
  CalendarClock,
  CalendarDays,
  FileVideoCamera,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetCalls } from "@/hooks/useGetCalls";
import Loader from "./Loader";
import MeetingCard from "./MeetingCard";

interface CallListProps {
  type: "ended" | "upcoming" | "recordings";
}

export default function CallList({ type }: CallListProps) {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData =
        (await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
        )) || [];

      const recs = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recs);
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  const formatMeetingTime = (dateString: string | Date | undefined) => {
    if (!dateString) return "Invalid Date";

    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hourCycle: "h12",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    return date.toLocaleString("en", options);
  };

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  console.log(new Date("2025-11-16T01:50:35.94563Z").toLocaleString());
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={
              type === "recordings"
                ? (meeting as CallRecording).url
                : (meeting as Call).id
            }
            Icon={
              type === "ended"
                ? CalendarClock
                : type === "upcoming"
                  ? CalendarDays
                  : FileVideoCamera
            }
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "No Description"
            }
            date={formatMeetingTime(
              (meeting as Call).state?.startsAt ||
                (meeting as CallRecording).start_time,
            )}
            isPreviousMeeting={type === "ended"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            ButtonIcon1={type === "recordings" ? Play : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-black">{noCallsMessage}</h1>
      )}
    </div>
  );
}
