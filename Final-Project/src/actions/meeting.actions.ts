"use server";

import { createMeeting } from "@/services/meeting.service";
import { auth } from "@clerk/nextjs/server"; // <--- IMPORTANTE
import { revalidatePath } from "next/cache";

export async function createMeetingAction(formData: FormData) {
  // 1. Obtenemos el usuario real que está logueado
  const { userId } = auth();

  if (!userId) {
    throw new Error("Debes estar logueado para crear una reunión");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // 2. Pasamos el userId REAL como hostId
  const meeting = await createMeeting(title, userId, description);

  revalidatePath("/dashboard");
  return meeting;
}