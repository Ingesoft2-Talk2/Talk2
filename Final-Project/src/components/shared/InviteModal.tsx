"use client";

import { Mail, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ReactPortal from "./ReactPortal";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  callId: string;
  title: string;
}

interface Invitee {
  email: string;
  name?: string;
}

/**
 * Modal component for sending email invitations to a meeting.
 * Allows users to add multiple email addresses and send invites via an API.
 *
 * @component
 * @param {InviteModalProps} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {string} props.callId - The ID of the call to invite users to.
 * @param {string} props.title - The title of the meeting.
 * @returns {JSX.Element | null} The rendered modal or null if not open.
 */
export default function InviteModal({
  isOpen,
  onClose,
  callId,
  title,
}: InviteModalProps) {
  const [emailInput, setEmailInput] = useState("");
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddEmail = () => {
    if (!emailInput) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (invitees.some((i) => i.email === emailInput)) {
      toast.error("Email already added");
      return;
    }

    setInvitees([...invitees, { email: emailInput }]);
    setEmailInput("");
  };

  const handleRemoveInvitee = (email: string) => {
    setInvitees(invitees.filter((i) => i.email !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSendInvites = async () => {
    if (invitees.length === 0) {
      toast.error("Please add at least one email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/call/${callId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitees }),
      });

      if (!response.ok) {
        throw new Error("Failed to send invitations");
      }

      toast.success("Invitations sent successfully!");
      onClose();
      setInvitees([]);
      setEmailInput("");
    } catch {
      toast.error("Failed to send invitations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Invite to {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-black"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                type="button"
                onClick={handleAddEmail}
                className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="min-h-[100px] max-h-[200px] overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
              {invitees.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  No invitees added yet
                </p>
              ) : (
                invitees.map((invitee) => (
                  <div
                    key={invitee.email}
                    className="flex items-center justify-between bg-white p-2 rounded shadow-sm border border-gray-200"
                  >
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                      {invitee.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInvitee(invitee.email)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvites}
                disabled={isLoading || invitees.length === 0}
                className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? "Sending..." : "Send Invites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
}
