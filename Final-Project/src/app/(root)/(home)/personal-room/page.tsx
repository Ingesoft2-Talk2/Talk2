"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGetCallById } from "@/hooks/useGetCallById";

const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium lg:text-xl xl:min-w-32">{title}:</h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

export default function PersonalRoom() {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();

  const meetingId = user?.id;

  const { call } = useGetCallById(meetingId ?? "");

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(meetingLink);
      toast.success("Link Copied");
      toast.clearWaitingQueue();
    } catch {
      toast.error("Error copying the link");
      toast.clearWaitingQueue();
    }
  };

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId ?? "");

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

  return (
    <section className="flex size-full flex-col gap-10 text-black">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId ?? ""} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <button
          type="button"
          className={
            "bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-md p-2 cursor-pointer hover:bg-blue-700 flex items-center justify-center gap-3"
          }
          onClick={startRoom}
        >
          Start Meeting
        </button>
        <button
          type="button"
          className={
            "bg-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 text-black rounded-md p-2 cursor-pointer hover:bg-gray-400 flex items-center justify-center gap-3"
          }
          onClick={handleCopyLink}
        >
          Copy Invitation
        </button>
      </div>
    </section>
  );
}
