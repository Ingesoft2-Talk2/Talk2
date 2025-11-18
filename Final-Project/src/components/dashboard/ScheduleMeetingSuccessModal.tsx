"use client";

import { CalendarCheck2, Copy } from "lucide-react";
import { toast } from "react-toastify";
import ReactPortal from "@/components/shared/ReactPortal";

type JoinMeetingModal = {
  isOpen: boolean;
  link: string;
  handleClose: () => void;
};

export default function ScheduleMeetingSuccessModal({
  isOpen,
  link,
  handleClose,
}: JoinMeetingModal) {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(link);
      toast.success("Link Copied");
      toast.clearWaitingQueue();
    } catch {
      toast.error("Error copying the link");
      toast.clearWaitingQueue();
    }
  };

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
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
            <div className="flex justify-center items-center">
              <CalendarCheck2 size={72} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold leading-[42px] flex justify-center">
              Meeting Scheduled
            </h1>
            <button
              type="button"
              onClick={handleCopyLink}
              className={
                "bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-md p-2 cursor-pointer hover:bg-blue-700 flex items-center justify-center gap-3"
              }
            >
              Copy Meeting Link
              <Copy size={18} />
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
