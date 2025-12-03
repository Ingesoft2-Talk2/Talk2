/*
 * This file defines the StreamVideoProvider component.
 * It initializes the Stream Video client with the user's credentials and wraps the application
 * to provide video calling capabilities.
 */

"use client";

import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { tokenProvider } from "@/../actions/stream.actions";
import Loader from "@/components/shared/Loader";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

/**
 * Provider component that sets up the Stream Video client.
 * It handles user authentication and client initialization.
 *
 * @param children - The child components to be wrapped by the provider.
 * @returns The StreamVideo provider wrapping the children, or a loader while initializing.
 */
export default function StreamVideoProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!API_KEY) throw new Error("Stream API key is missing");

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },

      tokenProvider,
    });

    setVideoClient(client);
  }, [user, isLoaded]);

  if (!videoClient) return <Loader text="Creating your video client..." />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
