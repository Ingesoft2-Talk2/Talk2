/*
 * This file defines a custom hook to fetch and categorize calls (meetings) for the current user.
 * It retrieves calls from Stream.io and filters them into ended, upcoming, and recorded calls.
 */

import { useUser } from "@clerk/nextjs";
import type { Call } from "@stream-io/video-react-sdk";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to manage call data.
 *
 * @returns An object containing:
 * - endedCalls: List of calls that have finished.
 * - upcomingCalls: List of calls scheduled for the future.
 * - nextUpcomingCall: The nearest upcoming call.
 * - callRecordings: All calls fetched.
 * - isLoading: Boolean indicating if data is being fetched.
 * - refetch: Function to manually reload calls.
 */
export const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();

  // State to store the list of calls
  const [calls, setCalls] = useState<Call[]>();
  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetches calls from the Stream client.
   * Filters by calls created by the user or where the user is a member.
   */
  const loadCalls = useCallback(async () => {
    if (!client || !user?.id) return;

    setIsLoading(true);

    try {
      const { calls } = await client.queryCalls({
        sort: [{ field: "starts_at", direction: -1 }],
        filter_conditions: {
          starts_at: { $exists: true },
          $or: [
            { created_by_user_id: user.id },
            { members: { $in: [user.id] } },
          ],
        },
        limit: 10,
      });

      setCalls(calls);
    } finally {
      setIsLoading(false);
    }
  }, [client, user?.id]);

  useEffect(() => {
    loadCalls();
  }, [loadCalls]);

  const now = new Date();

  // Filter calls that have ended
  const endedCalls = calls?.filter(
    ({ state: { startsAt, endedAt } }: Call) =>
      (startsAt && new Date(startsAt) < now) || !!endedAt,
  );

  // Filter and sort upcoming calls
  const upcomingCalls = calls
    ?.filter(({ state: { startsAt } }: Call) => {
      return startsAt && new Date(startsAt) > now;
    })
    ?.sort(
      (a, b) =>
        new Date(a.state.startsAt ?? "").getTime() -
        new Date(b.state.startsAt ?? "").getTime(),
    );

  const nextUpcomingCall = upcomingCalls?.[0];

  return {
    endedCalls,
    upcomingCalls,
    nextUpcomingCall,
    callRecordings: calls,
    isLoading,
    refetch: loadCalls,
  };
};
