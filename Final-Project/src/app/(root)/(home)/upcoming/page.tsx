import CallList from "@/components/shared/CallList";

export default function Upcoming() {
  return (
    <section className="flex size-full flex-col gap-10 text-black">
      <h1 className="text-3xl font-bold">Upcoming Meetings</h1>

      <CallList type="upcoming" />
    </section>
  );
}
