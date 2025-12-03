"use client";

import Image from "next/image";
import DHeader from "@/assets/dashboard/dashboard-header.jpg";
import JoinMeeting from "@/components/dashboard/JoinMeeting";
import NewMeeting from "@/components/dashboard/NewMeeting";
import ScheduleMeeting from "@/components/dashboard/ScheduleMeeting";
import { useGetCalls } from "@/hooks/useGetCalls";

/**
 * The main dashboard page for authenticated users.
 * Displays the current time, date, and upcoming meeting information.
 * Provides quick access to meeting actions like starting, joining, or scheduling a meeting.
 *
 * @component
 * @returns {JSX.Element} The rendered dashboard page.
 */
export default function Dashboard() {
  const { nextUpcomingCall, isLoading } = useGetCalls();
  const now = new Date();

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    now,
  );

  let upcomingMeetingText: string;

  if (isLoading) {
    upcomingMeetingText = "Loading...";
  } else if (nextUpcomingCall?.state?.startsAt) {
    const meetingDate = new Date(nextUpcomingCall.state.startsAt);
    const isToday =
      meetingDate.getFullYear() === now.getFullYear() &&
      meetingDate.getMonth() === now.getMonth() &&
      meetingDate.getDate() === now.getDate();

    upcomingMeetingText = isToday
      ? `Upcoming Meeting: ${meetingDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "No meetings scheduled for today";
  } else {
    upcomingMeetingText = "No meetings scheduled for today";
  }

  return (
    <section className="flex size-full flex-col gap-5 text-black">
      <div className="relative h-72 w-full rounded-xl overflow-hidden">
        <Image
          src={DHeader}
          alt="Dashboard Header"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative z-10 flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11 md:px-5 py-8 backdrop-brightness-90 rounded-xl">
          <h2 className="max-w-[273px] rounded py-2 text-center text-base font-normal bg-gray-200 ">
            {upcomingMeetingText}
          </h2>

          <div className="flex flex-col gap-2 drop-shadow-md">
            <h1
              data-testid="dashboard-time"
              className="text-4xl font-extrabold lg:text-7xl"
            >
              {time}
            </h1>
            <p
              data-testid="dashboard-date"
              className="text-lg font-medium lg:text-2xl"
            >
              {date}
            </p>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <NewMeeting />
        <JoinMeeting />
        <ScheduleMeeting />
      </section>
    </section>
  );
}
