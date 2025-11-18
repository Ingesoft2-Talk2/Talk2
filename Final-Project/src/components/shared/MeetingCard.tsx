"use client";

import { Copy } from "lucide-react";
import { toast } from "react-toastify";

interface MeetingCardProps {
  title: string;
  date: string;
  Icon: React.ElementType;
  isPreviousMeeting?: boolean;
  ButtonIcon1?: React.ElementType;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

export default function MeetingCard({
  Icon,
  title,
  date,
  isPreviousMeeting,
  ButtonIcon1,
  handleClick,
  link,
  buttonText,
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
    <section className="flex min-h-[200px] w-full flex-col gap-4 rounded-[14px] px-5 py-5 xl:max-w-[568px] bg-gray-100 text-black shadow-xl border border-gray-400">
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
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className={
                "bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-md p-2 px-6 cursor-pointer hover:bg-blue-700 flex items-center justify-center gap-3"
              }
            >
              {ButtonIcon1 && <ButtonIcon1 size={18} strokeWidth={1.5} />}
              {buttonText}
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className={
                "bg-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-white rounded-md p-2 cursor-pointer hover:bg-blue-700 flex items-center justify-center gap-3"
              }
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
