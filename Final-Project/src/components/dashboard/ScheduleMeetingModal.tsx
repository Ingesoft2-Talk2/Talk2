"use client";

import ReactPortal from "@/components/shared/ReactPortal";

type ScheduleMeetingModal = {
  isOpen: boolean;
  handleClose: () => void;
};

export default function ScheduleMeetingModal({
  isOpen,
  handleClose,
}: ScheduleMeetingModal) {
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
            <h1 className="text-3xl font-bold leading-[42px]">
              Create Meeting
            </h1>
            <div className="flex flex-col gap-2.5">
              <label
                htmlFor="meeting-description"
                className="text-base font-normal leading-[22.4px] text-sky-2"
              >
                Add a description
              </label>
              <textarea
                id="meeting-description"
                className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-200 rounded-md p-2 max-h-40 resize-y min-h-24 focus:outline-none"
              />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <label
                htmlFor="meeting-datetime"
                className="text-base font-normal leading-[22.4px] text-sky-2"
              >
                Select Date and Time
              </label>
              <input
                id="meeting-datetime"
                type="datetime-local"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none bg-gray-200"
              />
            </div>

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
