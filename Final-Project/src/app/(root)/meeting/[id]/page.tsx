"use client";

import { useParams } from "next/navigation";

export default function MeetingPage() {
  const { id } = useParams();
  const meetingId = id ? id : "Loading...";

  return <div className="text-black">Meeting ID: {meetingId}</div>;
}
