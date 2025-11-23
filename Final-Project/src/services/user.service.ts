import { prisma } from "@/lib/prisma"; // Importación corregida

export const createUser = async (email: string, name: string, clerkId: string, imageUrl?: string) => {
  // Usamos 'upsert' para manejar registro (create) y login (update) en una sola función
  return prisma.user.upsert({
    where: { clerkId }, // Buscamos por el ID único de Clerk
    update: {
      email,
      name,
      imageUrl,
      lastLoginAt: new Date(), // Actualizamos la fecha de último acceso
    },
    create: {
      clerkId,
      email,
      name,
      imageUrl,
    },
  });
};