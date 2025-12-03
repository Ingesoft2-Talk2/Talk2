import CallList from "@/components/shared/CallList";

/**
 * Page displaying a list of upcoming scheduled meetings.
 * Uses the CallList component to fetch and render future calls.
 *
 * @component
 * @returns {JSX.Element} The rendered upcoming meetings page.
 */
export default function Upcoming() {
  return (
    <section className="flex size-full flex-col gap-10 text-black">
      <h1 className="text-3xl font-bold">Upcoming Meetings</h1>

      <CallList type="upcoming" />
    </section>
  );
}
