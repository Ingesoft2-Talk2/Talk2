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
import { formatDate } from "@/utils/date";
import Loader from "./Loader";
import MeetingCard from "./MeetingCard";

interface CallListProps {
  type: "ended" | "upcoming" | "recordings";
}

export default function CallList({ type }: CallListProps) {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading, refetch } =
    useGetCalls();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

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

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
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
            date={formatDate(
              (meeting as Call).state?.startsAt ||
                (meeting as CallRecording).start_time,
              "readable",
            )}
            callType={type}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            ButtonIcon1={type === "recordings" ? Play : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={() => {
              if (isNavigating) return;

              setIsNavigating(true);

              if (type === "recordings") {
                router.push(`${(meeting as CallRecording).url}`);
              } else {
                router.push(`/meeting/${(meeting as Call).id}`);
              }
            }}
            call_id={type === "recordings" ? "" : (meeting as Call).id}
            startsAt={
              type === "recordings"
                ? ""
                : formatDate((meeting as Call).state?.startsAt, "iso")
            }
            description={
              type === "recordings"
                ? ""
                : (meeting as Call).state?.custom?.description
            }
            session_id={
              type === "recordings" ? (meeting as CallRecording).session_id : ""
            }
            filename={
              type === "recordings" ? (meeting as CallRecording).filename : ""
            }
            refetch={refetch}
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-black">{noCallsMessage}</h1>
      )}
    </div>
  );
}
