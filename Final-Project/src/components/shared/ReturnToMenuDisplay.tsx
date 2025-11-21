"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReturnToMenuDisplayProps {
  title: string;
  Icon?: React.ElementType;
}

export default function ReturnToMenuDisplay({
  title,
  Icon,
}: ReturnToMenuDisplayProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    router.push("/dashboard");
  };

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

          <button
            type="button"
            onClick={handleClick}
            disabled={isNavigating}
            className={`w-full text-center py-3 rounded-md p-2 text-white border-none
              ${
                isNavigating
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
              }
            `}
          >
            {isNavigating ? "Loading..." : "Back to Dashboard"}
          </button>
        </div>
      </div>
    </section>
  );
}
