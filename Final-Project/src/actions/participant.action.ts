"use server";

import { joinMeeting, updateParticipantRole } from "@/services/participant.service";

export async function joinMeetingAction(meetingId: string, userId: string) {
  return await joinMeeting(meetingId, userId);
}

export async function updateRoleAction(participantId: string, role: "HOST" | "ATTENDEE") {
  return await updateParticipantRole(participantId, role);
}
