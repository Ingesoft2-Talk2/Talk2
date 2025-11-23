"use client";

import { useUser } from "@clerk/nextjs";
import { Check, MoreVertical, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DeleteFriendModal from "./DeleteFriendModal";

interface FriendCardOptionsMenuProps {
  friend_id?: string;
  friend_status?: string;
  refetch: () => void;
}

export default function FriendCardOptionsMenu({
  friend_id,
  friend_status,
  refetch,
}: FriendCardOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteFriendModalOpen, setDeleteFriendModalOpen] = useState(false);
  const { user } = useUser();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left z-10">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-1 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Opciones"
      >
        <MoreVertical size={24} strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          role="menu"
        >
          <div className="py-1" role="none">
            {friend_status === "ACCEPTED" && (
              <button
                type="button"
                onClick={() => {
                  setDeleteFriendModalOpen(true);
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <Trash className="mr-3 h-5 w-5 text-red-400" />
                Delete
              </button>
            )}

            {friend_status === "PENDING" && (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    await fetch(
                      `/api/friend-request/${friend_id}?currentUserId=${user?.id}`,
                      {
                        method: "PATCH",
                      },
                    );

                    refetch();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 cursor-pointer"
                >
                  <Check className="mr-3 h-5 w-5 text-green-500" />
                  Accept
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await fetch(
                      `/api/friend-request/${friend_id}?currentUserId=${user?.id}`,
                      {
                        method: "DELETE",
                      },
                    );

                    refetch();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <X className="mr-3 h-5 w-5 text-red-500" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {deleteFriendModalOpen && (
        <DeleteFriendModal
          isOpen={deleteFriendModalOpen}
          friend_id={friend_id}
          currentUserId={user?.id}
          refetch={refetch}
          handleClose={() => setDeleteFriendModalOpen(false)}
        />
      )}
    </div>
  );
}
