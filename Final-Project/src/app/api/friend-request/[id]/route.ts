import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
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
  { params }: { params: { id: string } },
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
  { params }: { params: { id: string } },
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
