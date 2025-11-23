"use server";

import { NextResponse } from "next/server";
import { tokenProvider } from "@/../actions/stream.actions";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const streamBaseUrl = process.env.NEXT_PUBLIC_STREAM_BASE_URL;

//It's a delete request, but the API treats the delete as a POST.
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const callType = "default";

    if (!id) {
      return NextResponse.json({ message: "Missing callId" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ message: "Missing apiKey" }, { status: 400 });
    }

    const url = `${streamBaseUrl}/video/call/${callType}/${id}/delete?api_key=${apiKey}`;

    const token = await tokenProvider();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Stream-Auth-Type": "jwt",
        Authorization: token,
      },
    });

    if (response.status === 201) {
      return NextResponse.json(
        { message: "Call deleted successfully" },
        { status: 200 },
      );
    }

    const errorData = await response.text();
    throw new Error(
      `Stream API failed with status ${response.status}: ${errorData}`,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to hard delete call",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

type UpdateCallPayload = {
  custom?: {
    description: string;
  };
  starts_at?: string;
};

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const callType = "default";

    const body = await req.json();
    const { description, startsAt } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing callId" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ message: "Missing apiKey" }, { status: 400 });
    }

    if (!description && !startsAt) {
      return NextResponse.json({ message: "Missing changes" }, { status: 400 });
    }

    const payload: UpdateCallPayload = {};

    if (description) {
      payload.custom = { description };
    }

    if (startsAt) {
      payload.starts_at = startsAt;
    }

    const url = `${streamBaseUrl}/video/call/${callType}/${id}?api_key=${apiKey}`;

    const token = await tokenProvider();

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Stream-Auth-Type": "jwt",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 200 || response.status === 201) {
      return NextResponse.json(
        { message: "Call updated successfully" },
        { status: 200 },
      );
    }

    const errorData = await response.text();
    throw new Error(
      `Stream API failed with status ${response.status}: ${errorData}`,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update call",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
