"use server";

import { NextResponse } from "next/server";
import { tokenProvider } from "@/../actions/stream.actions";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const streamBaseUrl = process.env.NEXT_PUBLIC_STREAM_BASE_URL;
const N8N_WEBHOOK_URL =
  "https://acsorbi3.app.n8n.cloud/webhook/80b5507d-77ab-49cc-8aae-1fc445637586";

/**
 * POST handler to send meeting invitations via email.
 * Fetches meeting details from Stream and triggers an n8n webhook to send emails.
 *
 * @param req - The request object containing the list of invitees.
 * @param params - The route parameters containing the call ID.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { invitees } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing callId" }, { status: 400 });
    }

    if (!invitees || !Array.isArray(invitees) || invitees.length === 0) {
      return NextResponse.json(
        { message: "Missing or invalid invitees" },
        { status: 400 },
      );
    }

    // 1. Fetch meeting details from Stream API
    const callType = "default";
    const url = `${streamBaseUrl}/video/call/${callType}/${id}?api_key=${apiKey}`;
    const token = await tokenProvider();

    const streamResponse = await fetch(url, {
      method: "GET",
      headers: {
        "Stream-Auth-Type": "jwt",
        Authorization: token,
      },
    });

    if (!streamResponse.ok) {
      const errorData = await streamResponse.text();
      throw new Error(
        `Stream API failed with status ${streamResponse.status}: ${errorData}`,
      );
    }

    const streamData = await streamResponse.json();
    const callData = streamData.call;

    // 2. Construct payload for n8n
    const meetingDetails = {
      id: callData.id,
      title: callData.custom?.description || "No Title",
      description: callData.custom?.description || "",
      startDateTime: callData.starts_at,
      endDateTime: callData.ends_at, // Might be null if not set
      timezone: "America/Bogota", // Defaulting as per request context, or could be dynamic if stored
      location: "Online",
      meetingLink: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callData.id}`,
    };

    const n8nPayload = {
      action: "create_meeting_invites",
      meeting: meetingDetails,
      invitees: invitees,
    };

    // 3. Send to n8n
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      throw new Error(
        `n8n Webhook failed with status ${n8nResponse.status}: ${errorText}`,
      );
    }

    return NextResponse.json(
      { message: "Invitations sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to send invitations",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
