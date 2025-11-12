"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReactPortal from "@/components/shared/ReactPortal";

type NewMeetingModal = {
  isOpen: boolean;
  handleClose: () => void;
};

export default function NewMeetingModal({
  isOpen,
  handleClose,
}: NewMeetingModal) {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const router = useRouter();

  if (!isOpen) return null;

  const createInstantMeeting = async () => {
    if (!client || !user) {
      toast.error("User or client not available");
      return;
    }
    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create meeting");

      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: { description: "Instant Meeting" },
        },
      });

      router.push(`/meeting/${call.id}`);
      toast.success("Meeting Created");
    } catch {
      toast.error("Failed to create Meeting");
    }
  };

  if (!client || !user) return <div>TODO: Loader</div>;

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="text-gray-500 hover:text-black cursor-pointer"
              onClick={handleClose}
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-6 text-black">
            <h1 className="text-3xl font-bold leading-[42px] flex justify-center">
              Start an Instant Meeting
            </h1>
            <button
              type="button"
              className={
                "bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-md p-2 cursor-pointer hover:bg-blue-700"
              }
              onClick={() => createInstantMeeting()}
            >
              &nbsp; Start Meeting
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
