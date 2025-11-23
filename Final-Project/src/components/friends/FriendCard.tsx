"use client";

import { UserIcon } from "lucide-react";
import Image from "next/image";
import FriendCardOptionsMenu from "./FriendCardOptionsMenu";

interface FriendCardProps {
  name: string;
  imageUrl?: string;
  friend_status?: string;
  friend_id: string;
  refetch: () => void;
}

export default function FriendCard({
  name,
  imageUrl,
  friend_id,
  friend_status,
  refetch,
}: FriendCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-sm">
      <div className="flex items-center gap-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            width={500}
            height={500}
            alt={`Foto de ${name}`}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-600" />
          </div>
        )}

        <p className="text-lg font-medium text-gray-800">{name}</p>
      </div>
      <FriendCardOptionsMenu
        friend_id={friend_id}
        friend_status={friend_status}
        refetch={refetch}
      />
    </div>
  );
}
