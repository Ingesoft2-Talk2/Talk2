"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { ClerkUserAPI } from "@/types/ClerkUser";
import type { SimpleUser } from "@/types/SimpleUser";

const apiKey = process.env.CLERK_SECRET_KEY;
const clerkBaseUrl = process.env.NEXT_PUBLIC_CLERK_BASE_URL;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";
    const currentUserId = searchParams.get("currentUserId");

    if (!currentUserId) {
      return NextResponse.json(
        { message: "Missing required parameter 'currentUserId'." },
        { status: 401 },
      );
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const url =
      query.trim() === ""
        ? `${clerkBaseUrl}/users?limit=10`
        : `${clerkBaseUrl}/users?query=${encodedQuery}&limit=10`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch users from Clerk." },
        { status: 500 },
      );
    }

    const clerkData: ClerkUserAPI[] = await response.json();

    const users: SimpleUser[] = clerkData.map((u: ClerkUserAPI) => {
      const fullName =
        u.first_name && u.last_name
          ? `${u.first_name} ${u.last_name}`
          : (u.first_name ?? u.username ?? "Unknown User");

      return {
        id: u.id,
        name: fullName,
        username: u.username,
        image: u.image_url,
      };
    });

    const filteredUsers = users.filter(
      (user: SimpleUser) =>
        user.id !== currentUserId && user.name !== "cypress",
    );

    const targetIds = filteredUsers.map((u) => u.id);

    const relations = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: { in: targetIds } },
          { receiverId: currentUserId, senderId: { in: targetIds } },
        ],
      },
    });

    const usersWithStatus = filteredUsers.map((user) => {
      const relation = relations.find(
        (r: {
          id: string;
          senderId: string;
          receiverId: string;
          status: string;
        }) =>
          (r.senderId === currentUserId && r.receiverId === user.id) ||
          (r.receiverId === currentUserId && r.senderId === user.id),
      );

      if (!relation) return user;

      return {
        ...user,
        friend_status: relation.status,
      };
    });

    return NextResponse.json(usersWithStatus);
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
