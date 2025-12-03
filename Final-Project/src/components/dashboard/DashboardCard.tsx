/*
 * This file defines the DashboardCard component.
 * It renders a card with an icon, title, and description, used for quick actions on the dashboard.
 */

"use client";

interface DashboardCardProps {
  color: string;
  Icon: React.ElementType;
  title: string;
  description: string;
  handleClick?: () => void;
}

/**
 * Reusable card component for the dashboard.
 *
 * @param props - The properties for the dashboard card.
 */
export default function DashboardCard({
  color,
  Icon,
  title,
  description,
  handleClick,
}: DashboardCardProps) {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${color} px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer text-left transition-transform hover:scale-[1.02] focus:outline-none `}
    >
      <div className="flex justify-center items-center size-12 rounded-[10px]">
        <Icon size={28} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </button>
  );
}
