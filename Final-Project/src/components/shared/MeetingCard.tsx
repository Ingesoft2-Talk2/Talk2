"use client";

import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import CardOptionsMenu from "./CardOptionsMenu";

interface MeetingCardProps {
  key: string;
  title: string;
  date: string;
  Icon: React.ElementType;
  callType: string;
  ButtonIcon1?: React.ElementType;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  call_id?: string;
  startsAt?: string;
  description?: string;
  session_id?: string;
  filename?: string;
  refetch: () => void;
}

export default function MeetingCard({
  Icon,
  title,
  date,
  callType,
  ButtonIcon1,
  handleClick,
  link,
  buttonText,
  call_id,
  startsAt,
  description,
  session_id,
  filename,
  refetch,
}: MeetingCardProps) {
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(link);
      toast.success("Link Copied");
      toast.clearWaitingQueue();
    } catch {
      toast.error("Error copying the link");
      toast.clearWaitingQueue();
    }
  };

  return (
    <section className="flex min-h-[200px] w-full flex-col gap-4 rounded-[14px] px-5 py-5 xl:max-w-[568px] bg-gray-100 text-black shadow-xl border border-gray-400 relative">
      <div className="absolute top-4 right-4 z-20">
        <CardOptionsMenu
          call_id={call_id}
          startsAt={startsAt}
          description={description}
          callType={callType}
          session_id={session_id}
          filename={filename}
          refetch={refetch}
        />
      </div>
      <article className="flex flex-col gap-4">
        <Icon size={30} strokeWidth={1.5} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
      </article>
      <article className={`flex justify-end relative`}>
        {(callType === "upcoming" || callType === "recordings") && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="rounded-md p-2 px-6 text-white flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-700 cursor-pointer"
            >
              {ButtonIcon1 && <ButtonIcon1 size={18} strokeWidth={1.5} />}
              {buttonText}
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-md p-2 cursor-pointer hover:bg-blue-700 flex items-center justify-center gap-3"
            >
              Copy Link
              <Copy size={18} />
            </button>
          </div>
        )}
      </article>
    </section>
  );
}
