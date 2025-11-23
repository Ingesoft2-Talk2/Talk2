"use server";

import { createUser } from "@/services/user.service";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUserAction() {
  // 1. Obtenemos el usuario actual de la sesión de Clerk
  const user = await currentUser();

  if (!user) return { success: false };

  // 2. Lógica para evitar nombres vacíos ("null null")
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Usuario";

  try {
    // 3. Llamamos al servicio
    await createUser(
      user.emailAddresses[0].emailAddress,
      name,
      user.id, // El clerkId fundamental
      user.imageUrl
    );
    return { success: true };
  } catch (error) {
    console.error("Error syncing user:", error);
    return { success: false };
  }
}