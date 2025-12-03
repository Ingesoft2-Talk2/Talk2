import CallList from "@/components/shared/CallList";

/**
 * Page displaying a list of previously ended meetings.
 * Uses the CallList component to fetch and render the history of calls.
 *
 * @component
 * @returns {JSX.Element} The rendered previous meetings page.
 */
export default function Previous() {
  return (
    <section className="flex size-full flex-col gap-10 text-black">
      <h1 className="text-3xl font-bold">Previous Meetings</h1>

      <CallList type="ended" />
    </section>
  );
}
