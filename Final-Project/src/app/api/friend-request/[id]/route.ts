import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const url = new URL(req.url);
    const currentUserId = url.searchParams.get("currentUserId");
    const { id: otherUserId } = await params;

    if (!currentUserId || !otherUserId) {
      return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    const request = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
        status: "PENDING",
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.friendRequest.update({
      where: { id: request.id },
      data: { status: "ACCEPTED" },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get("currentUserId");
    const { id: otherUserId } = await params;

    if (!currentUserId) {
      return NextResponse.json(
        { message: "Missing currentUserId" },
        { status: 400 },
      );
    }

    if (!otherUserId) {
      return NextResponse.json(
        { message: "Missing other user id" },
        { status: 400 },
      );
    }

    if (currentUserId === otherUserId) {
      return NextResponse.json(
        { message: "Cannot send friend request to yourself" },
        { status: 400 },
      );
    }

    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Friend request already exists", friendRequest: existing },
        { status: 200 },
      );
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: currentUserId,
        receiverId: otherUserId,
        status: "PENDING",
      },
    });

    // Send notification
    try {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();

      const [sender, receiver] = await Promise.all([
        client.users.getUser(currentUserId),
        client.users.getUser(otherUserId),
      ]);

      const notificationData = {
        receiverId: otherUserId,
        receiverEmail: receiver.emailAddresses[0]?.emailAddress,
        senderName:
          `${sender.firstName || ""} ${sender.lastName || ""}`.trim() ||
          "Usuario",
        senderImageUrl: sender.imageUrl,
        friendRequestId: friendRequest.id,
      };

      if (notificationData.receiverEmail) {
        const notificationUrl =
          process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4000";
        await fetch(`${notificationUrl}/api/notifications/friend-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationData),
        });
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
      // Don't fail the request if notification fails
    }

    return NextResponse.json(
      { message: "Friend request sent", friendRequest },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: otherUserId } = await params;

    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get("currentUserId");

    if (!currentUserId || !otherUserId) {
      return NextResponse.json(
        { error: "Missing currentUserId or otherUserId" },
        { status: 400 },
      );
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "No friend request exists between these users" },
        { status: 404 },
      );
    }

    await prisma.friendRequest.delete({
      where: { id: existingRequest.id },
    });

    return NextResponse.json(
      { message: "Friend request deleted successfully" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
