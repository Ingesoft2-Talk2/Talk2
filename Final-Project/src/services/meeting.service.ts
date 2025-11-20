import { prisma } from "@/lib/db";

export const createMeeting = async (title: string, hostId: string, description?: string) => {
  return prisma.meeting.create({
    data: {
      title,
      description,
      hostId,
      code: Math.random().toString(36).substring(2, 10)
    }
  });
};

export const getMeeting = async (id: string) => {
  return prisma.meeting.findUnique({
    where: { id },
    include: { host: true, participants: true }
  });
};

export const startMeeting = async (meetingId: string) => {
  return prisma.meeting.update({
    where: { id: meetingId },
    data: {
      status: "LIVE",
      startsAt: new Date()
    }
  });
};

export const endMeeting = async (meetingId: string) => {
  return prisma.meeting.update({
    where: { id: meetingId },
    data: {
      status: "COMPLETED",
      endedAt: new Date()
    }
  });
};
