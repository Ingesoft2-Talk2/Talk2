import CallList from "@/components/shared/CallList";

export default function Recordings() {
  return (
    <section className="flex size-full flex-col gap-10 text-black">
      <h1 className="text-3xl font-bold">Recordings</h1>

      <CallList type="recordings" />
    </section>
  );
}
