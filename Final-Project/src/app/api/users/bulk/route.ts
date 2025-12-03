"use server";

import { NextResponse } from "next/server";
import type { ClerkUserAPI } from "@/types/ClerkUser";
import type { SimpleUser } from "@/types/SimpleUser";

const apiKey = process.env.CLERK_SECRET_KEY;
const clerkBaseUrl = process.env.NEXT_PUBLIC_CLERK_BASE_URL;

/**
 * POST handler to fetch multiple users from Clerk by their IDs.
 *
 * @param req - The request object containing the list of user IDs.
 * @returns A JSON response with the list of simplified user objects or an error message.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const ids: string[] = body.ids;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Missing or invalid 'ids' array." },
        { status: 400 },
      );
    }

    const userIdParams = ids.map((id) => `user_id=${id}`).join("&");

    const url = `${clerkBaseUrl}/users?${userIdParams}`;

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

    return NextResponse.json(users);
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
