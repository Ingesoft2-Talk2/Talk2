/*
 * This file defines the DeleteFriendModal component.
 * It displays a confirmation modal for removing a friend or deleting a friend request.
 */

"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import ReactPortal from "@/components/shared/ReactPortal";

type DeleteCallModal = {
  isOpen: boolean;
  friend_id?: string;
  currentUserId?: string;
  refetch: () => void;
  handleClose: () => void;
};

/**
 * Modal component to confirm friend deletion.
 * Handles the API call to remove the friend connection.
 *
 * @param props - The properties for the delete friend modal.
 */
export default function DeleteCallModal({
  isOpen,
  friend_id,
  currentUserId,
  refetch,
  handleClose,
}: DeleteCallModal) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    if (!friend_id || !currentUserId) {
      toast.error("Missing user IDs");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/friend-request/${friend_id}?currentUserId=${currentUserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete friend request");
      }

      toast.success("Friend request deleted successfully.");

      refetch();
      handleClose();
    } catch {
      toast.error("Failed to delete friend request");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-black">
              Delete this friend?
            </h1>
            <p className="text-gray-700 text-base">
              This action is irreversible. This friend request will be
              permanently deleted.
            </p>
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
              disabled={isDeleting}
              className={`px-4 py-2 rounded-md text-white cursor-pointer ${isDeleting ? "bg-red-300" : "bg-red-600 hover:bg-red-700"
                }`}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
