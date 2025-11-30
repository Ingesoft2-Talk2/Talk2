import { NextResponse } from "next/server";
import type { ClerkUserAPI } from "@/types/ClerkUser";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json(
        { error: "Missing request type" },
        { status: 400 },
      );
    }

    const requestUrlFR = `${process.env.NEXT_PUBLIC_BASE_URL}/api/friend-request?userId=${userId}&status=${type}`;

    const responseFR = await fetch(requestUrlFR, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") ?? "",
        "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
        "user-agent": req.headers.get("user-agent") ?? "",
      },
    });

    if (!responseFR.ok) {
      return NextResponse.json(
        { error: "Failed to fetch friend requests" },
        { status: 400 },
      );
    }

    const friendRequests: { senderId: string; receiverId: string }[] =
      await responseFR.json();

    if (friendRequests.length === 0) {
      return NextResponse.json([]);
    }

    const friendIds = friendRequests.map((req) =>
      req.senderId === userId ? req.receiverId : req.senderId,
    );

    const requestUrlClerk = `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/bulk`;

    const responseClerk = await fetch(requestUrlClerk, {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") ?? "",
        "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
        "user-agent": req.headers.get("user-agent") ?? "",
      },
      body: JSON.stringify({ ids: friendIds }),
    });

    if (!responseClerk.ok) {
      return NextResponse.json(
        { message: "Failed to fetch users from Clerk." },
        { status: 500 },
      );
    }

    const clerkData: ClerkUserAPI[] = await responseClerk.json();

    return NextResponse.json(clerkData);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
