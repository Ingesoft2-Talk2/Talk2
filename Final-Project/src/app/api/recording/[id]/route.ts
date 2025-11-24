"use server";

import { NextResponse } from "next/server";
import { tokenProvider } from "@/../actions/stream.actions";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const streamBaseUrl = process.env.NEXT_PUBLIC_STREAM_BASE_URL;

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    const filename = searchParams.get("filename");

    if (!id) {
      return NextResponse.json({ message: "Missing callId" }, { status: 400 });
    }

    if (!session_id) {
      return NextResponse.json(
        { message: "Missing session_id" },
        { status: 400 },
      );
    }

    if (!filename) {
      return NextResponse.json(
        { message: "Missing filename" },
        { status: 400 },
      );
    }

    if (!apiKey) {
      return NextResponse.json({ message: "Missing apiKey" }, { status: 400 });
    }

    const callType = "default";

    const url = `${streamBaseUrl}/video/call/${callType}/${id}/${session_id}/recordings/${filename}?api_key=${apiKey}`;

    const token = await tokenProvider();

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Stream-Auth-Type": "jwt",
        Authorization: token,
      },
    });

    if (response.status === 200) {
      return NextResponse.json(
        { message: "Recording deleted successfully" },
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
        message: "Failed to delete recording",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
