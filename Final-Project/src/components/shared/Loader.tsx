import { Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "Loading..." }: LoaderProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-transparent"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center">
        <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-black">
          {text}
        </p>
        <div className="mt-3">
          <Loader2
            className="w-12 h-12 animate-spin text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
