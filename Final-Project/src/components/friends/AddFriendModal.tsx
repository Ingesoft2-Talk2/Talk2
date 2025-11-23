"use client";

import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ReactPortal from "@/components/shared/ReactPortal";
import type { SimpleUser } from "@/types/SimpleUser";
import FriendResultCard from "./FriendResultCard";

type AddFriendModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

export default function AddFriendModal({
  isOpen,
  handleClose,
}: AddFriendModalProps) {
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SimpleUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const fetchUsers = async (query: string) => {
    try {
      setIsSearching(true);
      setHasSearched(true);

      const response = await fetch(
        `/api/users?q=${query}&currentUserId=${user?.id}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data: SimpleUser[] = await response.json();
      setSearchResults(data);
    } catch {
      toast.error("An error occurred during search.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
        <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-2xl">
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
            <h1 className="text-3xl font-bold flex justify-center text-gray-800">
              Search for Friends
            </h1>

            <div className="relative flex gap-2">
              <div className="relative w-full">
                <input
                  className="w-full border-none bg-gray-100 p-3 pl-10 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <button
                type="button"
                onClick={() => fetchUsers(searchQuery)}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 rounded-lg transition cursor-pointer"
              >
                Search
              </button>
            </div>

            <div className="mt-4 max-h-96 overflow-y-auto pr-2">
              {isSearching && (
                <p className="text-center text-blue-500">Searching...</p>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="flex flex-col gap-3">
                  {searchResults.map((userFriend) => (
                    <FriendResultCard
                      key={userFriend.id}
                      user={userFriend}
                      currentUserId={user?.id}
                      refetch={() => fetchUsers(searchQuery)}
                    />
                  ))}
                </div>
              )}

              {!isSearching && hasSearched && searchResults.length === 0 && (
                <p className="text-center text-gray-500">
                  No results. Try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
