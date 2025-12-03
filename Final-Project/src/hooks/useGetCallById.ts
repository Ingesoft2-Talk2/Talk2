/*
 * This file defines a custom hook to fetch a specific call by its ID.
 * It queries the Stream.io client for call details.
 */

import type { Call } from "@stream-io/video-react-sdk";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

/**
 * Custom hook to retrieve a call object by ID.
 *
 * @param id - The ID of the call to fetch. Can be a string or array of strings.
 * @returns An object containing:
 * - call: The fetched Call object.
 * - isCallLoading: Boolean indicating if the call is currently being fetched.
 */
export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      try {
        const { calls } = await client.queryCalls({
          filter_conditions: { id },
        });

        if (calls.length > 0) setCall(calls[0]);

        setIsCallLoading(false);
      } catch {
        toast.error("Error getting call by ID");
        setIsCallLoading(false);
      }
    };

    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
};
