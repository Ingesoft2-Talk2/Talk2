/*
 * This file defines the JoinMeetingModal component.
 * It provides a modal for users to enter a meeting link and join the call.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import ReactPortal from "@/components/shared/ReactPortal";

type JoinMeetingModal = {
  isOpen: boolean;
  handleClose: () => void;
};

/**
 * Modal component for joining a meeting via link.
 * Validates the link and navigates the user to the meeting page.
 *
 * @param props - The properties for the join meeting modal.
 */
export default function JoinMeetingModal({
  isOpen,
  handleClose,
}: JoinMeetingModal) {
  const router = useRouter();
  const [meetingLink, setMeetingLink] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  if (!isOpen) return null;

  const handleJoin = () => {
    if (isJoining) return;

    setIsJoining(true);

    let link = meetingLink.trim();

    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      link = `http://${link}`;
    }

    const BASE = `http://${process.env.NEXT_PUBLIC_BASE_URL}/meeting/`;
    const BASE_HTTPS = `https://${process.env.NEXT_PUBLIC_BASE_URL}/meeting/`;

    if (link.startsWith(BASE) || link.startsWith(BASE_HTTPS)) {
      router.push(link);
    } else {
      toast.error("Invalid Link");
      toast.clearWaitingQueue();
      setIsJoining(false);
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
            <h1 className="text-3xl font-bold leading-[42px] flex justify-center">
              Type the link here
            </h1>

            <input
              className="border-none bg-gray-200 p-2 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md focus:outline-none"
              placeholder="Meeting link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />

            <button
              type="button"
              disabled={isJoining}
              className={`rounded-md p-2 text-white 
                ${isJoining
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                }`}
              onClick={handleJoin}
            >
              {isJoining ? "Joining..." : "Join Meeting"}
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
