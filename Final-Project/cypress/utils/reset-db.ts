import prisma from "@/lib/db";

/**
 * Resets the database by deleting all friend requests.
 * Used to clean up state before tests.
 */
export async function resetDB() {
  await prisma.friendRequest.deleteMany({});
}
