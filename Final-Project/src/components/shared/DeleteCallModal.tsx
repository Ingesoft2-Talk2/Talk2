/*
 * This file defines the DeleteCallModal component.
 * It displays a confirmation modal for deleting a meeting or recording.
 */

"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import ReactPortal from "@/components/shared/ReactPortal";

type DeleteCallModal = {
  isOpen: boolean;
  call_id?: string;
  callType: string;
  session_id?: string;
  filename?: string;
  refetch: () => void;
  handleClose: () => void;
};

/**
 * Modal component to confirm deletion of a call or recording.
 * Handles the API call to delete the resource and updates the UI.
 *
 * @param props - The properties for the delete modal.
 */
export default function DeleteCallModal({
  isOpen,
  call_id,
  callType,
  session_id,
  filename,
  refetch,
  handleClose,
}: DeleteCallModal) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const isRecording = callType === "recordings";

  const actualCallId =
    isRecording && filename
      ? filename.match(/[0-9a-fA-F-]{36}/)?.[0] || null
      : call_id;

  const titleText = isRecording
    ? "Delete this recording?"
    : "Delete this meeting?";

  const descriptionText = isRecording
    ? "This action is irreversible. The recording and all associated data will be permanently deleted."
    : "This action is irreversible. The meeting and all associated data will be permanently deleted.";

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    if (!actualCallId) {
      toast.error("Missing call ID");
      setIsDeleting(false);
      return;
    }

    try {
      let response: Response;

      if (isRecording) {
        if (!session_id || !filename) {
          toast.error("Missing session_id or filename for deleting recording");
          setIsDeleting(false);
          return;
        }

        response = await fetch(
          `/api/recording/${actualCallId}?session_id=${session_id}&filename=${filename}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        response = await fetch(`/api/call/${actualCallId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      toast.success(
        isRecording
          ? "Recording deleted successfully."
          : "Meeting deleted successfully.",
      );

      refetch();
      handleClose();
    } catch {
      toast.error(
        isRecording ? "Failed to delete recording" : "Failed to delete meeting",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-black">{titleText}</h1>
            <p className="text-gray-700 text-base">{descriptionText}</p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
              onClick={handleClose}
            >
              Close
            </button>

            <button
              type="button"
              data-testid="confirm-delete-btn"
              disabled={isDeleting}
              className={`px-4 py-2 rounded-md text-white cursor-pointer
                ${isDeleting ? "bg-red-300" : "bg-red-600 hover:bg-red-700"}`}
              onClick={() => handleDelete()}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
