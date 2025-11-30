import prisma from "@/lib/db";

export async function resetDB() {
  await prisma.friendRequest.deleteMany({});
}
