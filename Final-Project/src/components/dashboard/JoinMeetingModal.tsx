"use client";

import ReactPortal from "@/components/shared/ReactPortal";

type JoinMeetingModal = {
  isOpen: boolean;
  handleClose: () => void;
};

export default function JoinMeetingModal({
  isOpen,
  handleClose,
}: JoinMeetingModal) {
  if (!isOpen) return null;

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
            ></input>
            <button
              type="button"
              className={
                "bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-md p-2 cursor-pointer hover:bg-blue-700"
              }
              onClick={() => console.log("todo")}
            >
              &nbsp; Join Meeting
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
