"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddFriendModal from "@/components/friends/AddFriendModal";
import FriendCard from "@/components/friends/FriendCard";
import Loader from "@/components/shared/Loader";
import type { SimpleUser } from "@/types/SimpleUser";

export default function Friends() {
  const { user, isLoaded } = useUser();
  const [friends, setFriends] = useState<SimpleUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<SimpleUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);

  const fetchFriends = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const userId = user.id;

      const friendsRes = await fetch(
        `/api/friends?userId=${userId}&type=ACCEPTED`,
      );
      const pendingRes = await fetch(
        `/api/friends?userId=${userId}&type=PENDING`,
      );

      if (!friendsRes.ok || !pendingRes.ok) throw new Error();

      const friendsData: SimpleUser[] = await friendsRes.json();
      const pendingData: SimpleUser[] = await pendingRes.json();

      setFriends(friendsData);
      setPendingRequests(pendingData);
    } catch {
      toast.error("Error loading your friends or friend requests.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchFriends();
    }
  }, [isLoaded, user?.id, fetchFriends]);

  if (!isLoaded || isLoading) {
    return <Loader text="Getting your friends..." />;
  }

  return (
    <section className="flex size-full flex-col gap-10 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">
          Friends List ({friends.length})
        </h1>

        <button
          type="button"
          onClick={() => setAddFriendModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition shadow-md cursor-pointer"
        >
          Add Friends
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend_id={friend.id}
              friend_status={"ACCEPTED"}
              name={friend.name ?? friend.username}
              imageUrl={friend.image ?? undefined}
              refetch={fetchFriends}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            You don't have any friends yet.
          </p>
        )}
      </div>

      {pendingRequests.length > 0 && (
        <section className="flex flex-col gap-10 mt-10">
          <h1 className="text-3xl font-bold text-black">
            Pending Friend Requests ({pendingRequests.length})
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((req) => (
              <FriendCard
                key={req.id}
                friend_id={req.id}
                friend_status={"PENDING"}
                name={req.name ?? req.username}
                imageUrl={req.image ?? undefined}
                refetch={fetchFriends}
              />
            ))}
          </div>
        </section>
      )}

      {isAddFriendModalOpen && (
        <AddFriendModal
          isOpen={isAddFriendModalOpen}
          handleClose={() => setAddFriendModalOpen(false)}
        />
      )}
    </section>
  );
}
