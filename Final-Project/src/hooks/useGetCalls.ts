import { useUser } from "@clerk/nextjs";
import type { Call } from "@stream-io/video-react-sdk";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useState } from "react";

export const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();

  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

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

  const endedCalls = calls?.filter(
    ({ state: { startsAt, endedAt } }: Call) =>
      (startsAt && new Date(startsAt) < now) || !!endedAt,
  );

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
