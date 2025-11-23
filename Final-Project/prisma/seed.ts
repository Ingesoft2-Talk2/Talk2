import prisma from "@/lib/db";

async function main() {
  await prisma.friendRequest.create({
    data: {
      senderId: "user_35FtwjYG51pP9mDrqqz9BfPYoZh",
      receiverId: "user_35l0z2i2GNAdcV7XXc6NxdWQ9zc",
      status: "ACCEPTED",
    },
  });

  await prisma.friendRequest.create({
    data: {
      senderId: "user_35ixtq8lww656KxiWChpthox04P",
      receiverId: "user_35FtwjYG51pP9mDrqqz9BfPYoZh",
      status: "PENDING",
    },
  });

  await prisma.friendRequest.create({
    data: {
      senderId: "user_35FtwjYG51pP9mDrqqz9BfPYoZh",
      receiverId: "user_35TsTZSZ697tibAVWVUB2w3CjQk",
      status: "ACCEPTED",
    },
  });

  await prisma.friendRequest.create({
    data: {
      senderId: "user_35FtwjYG51pP9mDrqqz9BfPYoZh",
      receiverId: "user_35eSqpihmYvdMEmdNs3T9G5UFtV",
      status: "ACCEPTED",
    },
  });

  console.log("Seeding done ✅");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
