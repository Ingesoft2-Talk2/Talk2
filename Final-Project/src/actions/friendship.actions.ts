"use server";

import { prisma } from "@/lib/prisma";

/**
 * Sends a friend request to a user by their email.
 */
export async function sendFriendRequest(userId: string, targetEmail: string) {
  // 1. Find the target user
const targetUser = await prisma.user.findUnique({
    where: { email: targetEmail },
});

if (!targetUser) {
    throw new Error("User not found");
}

if (targetUser.id === userId) {
    throw new Error("You cannot add yourself");
}

  // 2. Check if a friendship record already exists (in either direction)
const existingFriendship = await prisma.friendship.findFirst({
    where: {
        OR: [
            { requesterId: userId, addresseeId: targetUser.id },
            { requesterId: targetUser.id, addresseeId: userId },
        ],
        },
});

if (existingFriendship) {
    if (existingFriendship.status === "BLOCKED") {
        throw new Error("Unable to send request");
    }
    if (existingFriendship.status === "ACCEPTED") {
        throw new Error("You are already friends");
    }
    if (existingFriendship.status === "PENDING") {
        throw new Error("A request is already pending");
    }
}

  // 3. Create the request
return await prisma.friendship.create({
    data: {
        requesterId: userId,
        addresseeId: targetUser.id,
        status: "PENDING",
        },
    });
}

/**
 * Accepts a pending friend request.
 */
export async function acceptFriendRequest(friendshipId: string, userId: string) {
const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
});

if (!friendship) throw new Error("Request not found");

  // Security check: Only the addressee can accept
if (friendship.addresseeId !== userId) {
    throw new Error("Unauthorized");
}

return await prisma.friendship.update({
    where: { id: friendshipId },
    data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
        },
    });
}

/**
 * Blocks a user. 
 * Handles complex logic: If a friendship existed (even if started by the other person),
 * it deletes it and creates a new "BLOCKED" record where YOU are the requester.
 */
export async function blockUser(currentUserId: string, targetUserId: string) {
  // 1. Check for existing relationship
const existing = await prisma.friendship.findFirst({
    where: {
        OR: [
            { requesterId: currentUserId, addresseeId: targetUserId },
            { requesterId: targetUserId, addresseeId: currentUserId },
        ],
    },
});

  // 2. If exists, delete it so we can create a clean "Block" record
if (existing) {
    await prisma.friendship.delete({
        where: { id: existing.id },
    });
}

  // 3. Create the Block record (Current User -> Target User : BLOCKED)
return await prisma.friendship.create({
    data: {
        requesterId: currentUserId,
        addresseeId: targetUserId,
        status: "BLOCKED",
        },
    });
}

/**
 * DELETE Action:
 * Removes a friend, Cancels a sent request, or Rejects a received request.
 */
export async function removeFriend(currentUserId: string, targetUserId: string) {
  // 1. Find the relationship (regardless of who started it)
const friendship = await prisma.friendship.findFirst({
    where: {
        OR: [
        { requesterId: currentUserId, addresseeId: targetUserId },
        { requesterId: targetUserId, addresseeId: currentUserId },
        ],
    },
});

if (!friendship) {
    throw new Error("Relationship not found");
}

  // 2. Delete the record
return await prisma.friendship.delete({
    where: { id: friendship.id },
});
}

/**
 * Gets Pending requests sent TO the user
 */
export async function getIncomingRequests(userId: string) {
return await prisma.friendship.findMany({
    where: {
        addresseeId: userId,
        status: "PENDING",
        },
    include: {
        requester: { include: { profile: true } },
        },
    });
}