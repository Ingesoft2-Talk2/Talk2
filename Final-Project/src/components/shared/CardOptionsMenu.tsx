"use client";

import { Edit, MoreVertical, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DeleteCallModal from "./DeleteCallModal";
import EditCallModal from "./EditCallModal";

interface CardOptionsMenuProps {
  call_id?: string;
  startsAt?: string;
  description?: string;
  callType: string;
  session_id?: string;
  filename?: string;
  refetch: () => void;
}

export default function CardOptionsMenu({
  call_id,
  startsAt,
  description,
  callType,
  session_id,
  filename,
  refetch,
}: CardOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteCallModalOpen, setDeleteCallModalOpen] = useState(false);
  const [editCallModalOpen, setEditCallModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left z-10">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-1 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Opciones"
      >
        <MoreVertical size={24} strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          role="menu"
        >
          <div className="py-1" role="none">
            {callType === "upcoming" && (
              <button
                type="button"
                onClick={() => {
                  setEditCallModalOpen(true);
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <Edit className="mr-3 h-5 w-5 text-gray-400" />
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setDeleteCallModalOpen(true);
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <Trash className="mr-3 h-5 w-5 text-red-400" />
              Delete
            </button>
          </div>
        </div>
      )}

      {deleteCallModalOpen && (
        <DeleteCallModal
          isOpen={deleteCallModalOpen}
          call_id={call_id}
          callType={callType}
          session_id={session_id}
          filename={filename}
          refetch={refetch}
          handleClose={() => setDeleteCallModalOpen(false)}
        />
      )}

      {editCallModalOpen && (
        <EditCallModal
          isOpen={editCallModalOpen}
          call_id={call_id}
          startsAt={startsAt}
          description={description}
          refetch={refetch}
          handleClose={() => setEditCallModalOpen(false)}
        />
      )}
    </div>
  );
}
