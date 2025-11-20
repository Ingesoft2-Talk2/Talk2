import { prisma } from "@/lib/db";

export const joinMeeting = async (meetingId: string, userId: string, role = "ATTENDEE") => {
  return prisma.participant.create({
    data: {
      meetingId,
      userId,
      role
    }
  });
};

export const updateParticipantRole = async (participantId: string, role: "HOST" | "ATTENDEE") => {
  return prisma.participant.update({
    where: { id: participantId },
    data: { role }
  });
};
