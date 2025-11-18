import Link from "next/link";

interface ReturnToMenuDisplayProps {
  title: string;
  Icon?: React.ElementType;
}

export default function ReturnToMenuDisplay({
  title,
  Icon,
}: ReturnToMenuDisplayProps) {
  return (
    <section className="flex justify-center items-center h-screen w-full">
      <div className="w-full max-w-[520px] p-6 py-9 text-black rounded-2xl shadow-lg border border-gray-300">
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-3.5">
            {Icon && (
              <div className="flex justify-center items-center">
                <Icon size={72} strokeWidth={1.5} />
              </div>
            )}
            <p className="text-center text-xl">{title}</p>
          </div>

          <Link
            href="/dashboard"
            className="w-full text-center py-3 bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-md p-2 cursor-pointer hover:bg-blue-700 border-none"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
