"use client";

import { Plus, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import type { SimpleUser } from "@/types/SimpleUser";

type FriendResultCardProps = {
  user: SimpleUser;
  currentUserId?: string;
  refetch: () => void;
};

export default function FriendResultCard({
  user,
  currentUserId,
  refetch,
}: FriendResultCardProps) {
  const hasImage = typeof user.image === "string" && user.image.length > 0;
  const status = user.friend_status;

  const [isSending, setIsSending] = useState(false);

  const handleAddFriend = useCallback(async () => {
    if (!currentUserId) {
      toast.error("Missing current user ID");
      return;
    }

    if (isSending) return;
    setIsSending(true);

    try {
      const res = await fetch(
        `/api/friend-request/${user.id}?currentUserId=${currentUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to send friend request");
        return;
      }

      toast.success("Friend request sent!");

      refetch();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSending(false);
    }
  }, [currentUserId, user.id, isSending, refetch]);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-4">
        {hasImage ? (
          <Image
            src={user.image as string}
            alt={user.name ?? "Unknown User"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
            <User className="w-6 h-6 text-gray-600" />
          </div>
        )}

        <span className="text-gray-700">{user.name ?? user.username}</span>
      </div>

      <div>
        {status === "ACCEPTED" && (
          <span className="text-green-600">Friends</span>
        )}

        {status === "PENDING" && <span className="text-gray-600">Pending</span>}

        {!status && (
          <button
            type="button"
            disabled={isSending}
            className={`flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition cursor-pointer ${
              isSending ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={handleAddFriend}
          >
            <Plus className="w-4 h-4" />
            {isSending ? "Sending..." : "Add Friend"}
          </button>
        )}
      </div>
    </div>
  );
}
