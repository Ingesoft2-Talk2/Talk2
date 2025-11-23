import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const status = searchParams.get("status") as "PENDING" | "ACCEPTED";

    if (!userId || !status) {
      return NextResponse.json(
        { error: "Missing userId or status" },
        { status: 400 },
      );
    }

    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        status,
        OR: [{ receiverId: userId }, { senderId: userId }],
      },
    });

    return NextResponse.json(friendRequests);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
