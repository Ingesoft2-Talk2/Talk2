"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import ReactPortal from "@/components/shared/ReactPortal";

type EditCallModal = {
  isOpen: boolean;
  call_id?: string;
  startsAt?: string;
  description?: string;
  refetch: () => void;
  handleClose: () => void;
};

export default function EditCallModal({
  isOpen,
  call_id,
  startsAt,
  description,
  refetch,
  handleClose,
}: EditCallModal) {
  const [newDescription, setNewDescription] = useState(description ?? "");
  const [dateTime, setDateTime] = useState(startsAt ?? "");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = async (call_id?: string) => {
    if (isUpdating) return;

    setIsUpdating(true);

    const isDescriptionChanged = newDescription !== description;
    const isDateTimeChanged = dateTime !== startsAt;

    if (!isDescriptionChanged && !isDateTimeChanged) {
      toast.info("No has realizado cambios en la reunión.");
      setIsUpdating(false);
      return;
    }

    if (!call_id) {
      toast.error("Call ID is missing.");
      setIsUpdating(false);
      return;
    }

    const payload: { startsAt?: string; description?: string } = {};

    if (isDescriptionChanged && !isDateTimeChanged) {
      payload.description = newDescription;
      payload.startsAt = new Date(dateTime).toISOString();
    }

    if (!isDescriptionChanged && isDateTimeChanged) {
      payload.startsAt = new Date(dateTime).toISOString();
    }

    if (isDescriptionChanged && isDateTimeChanged) {
      payload.description = newDescription;
      payload.startsAt = new Date(dateTime).toISOString();
    }

    try {
      const response = await fetch(`/api/call/${call_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update call on server.",
        );
      }

      toast.success(`Meeting updated successfully.`);
      refetch();
      handleClose();
    } catch {
      toast.error("Failed to update the meeting");
    } finally {
      setIsUpdating(false);
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
            <h1 className="text-3xl font-bold leading-[42px]">
              Update Meeting
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
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
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
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full rounded bg-dark-3 p-2 focus:outline-none bg-gray-200"
              />
            </div>
            <button
              type="button"
              disabled={isUpdating}
              className={`rounded-md p-2 text-white
                        ${
                          isUpdating
                            ? "bg-gray-400"
                            : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
                        }`}
              onClick={() => handleUpdate(call_id)}
            >
              {isUpdating ? "Updating..." : "Update Meeting"}
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
