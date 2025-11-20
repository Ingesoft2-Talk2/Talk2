import { prisma } from '@/lib/prisma'; 

// Update type definition to include password and imageUrl
export async function updateUser(
  userId: string, 
  newData: { email?: string; name?: string; password?: string; imageUrl?: string }
) {
  // 1. Get the old data first
  const oldUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!oldUser) throw new Error("User not found");

  // 2. Use a Transaction to ensure both the Update and the Log happen together
  return await prisma.$transaction(async (tx) => {
    
    // Update the user
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { ...newData },
    });

    // Calculate what changed

    const changes: Record<string, any> = {};

    // Check Email
    if (newData.email && newData.email !== oldUser.email) {
      changes.email = { from: oldUser.email, to: newData.email };
    }

    // Check Name (Username)
    if (newData.name && newData.name !== oldUser.name) {
      changes.name = { from: oldUser.name, to: newData.name };
    }

    // Check Image URL
    if (newData.imageUrl && newData.imageUrl !== oldUser.imageUrl) {
      changes.imageUrl = { from: oldUser.imageUrl, to: newData.imageUrl };
    }

    // Check Password
    // SECURITY NOTE: Never log the actual password values! Just log that it changed.
    if (newData.password && newData.password !== oldUser.password) {
      changes.password = { from: "******", to: "******", status: "CHANGED" };
    }

    // Create the Audit Log only if something changed
    if (Object.keys(changes).length > 0) {
      await tx.userAuditLog.create({
        data: {
          userId: userId,
          action: "USER_UPDATE",
          changedBy: userId, // Or the ID of the admin performing the action
          details: changes, // Stores the JSON of changes
        },
      });
    }

    return updatedUser;
  });
}