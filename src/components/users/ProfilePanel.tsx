import React from "react";
import { X, Bell } from "lucide-react";
import type { FillHistoryItem, User } from "../../types";
import Button from "../common/Button";
import {
  useGetFillHistoryQuery,
  useSendReminderMutation,
} from "../../services/users/userApi";

interface ProfilePanelProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSendReminder: (userId: string, note?: string) => Promise<void>;
  isSending?: boolean;
}

const defaultNote =
  "Hi there! It looks like today’s entry is still missing, please take a moment to complete it now. Your input makes a real difference!";

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  user,
  isOpen,
  onClose,
  onSendReminder,
  isSending = false,
}) => {
  // const [sendReminder, { isLoading: isSending }] = useSendReminderMutation();
  const [note, setNote] = React.useState<string>(defaultNote);

  const { data: fillHistory = [], isLoading: fillLoading } =
    useGetFillHistoryQuery({
      userId: user?.id,
    });
  // console.log("fill hestory", fillHistory);

  if (!isOpen || !user) {
    return null;
  }

  const getFillStatutColor = (status: FillHistoryItem["status"]) => {
    switch (status) {
      case "Logged":
        return "bg-green-500";
      case "Missed":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-12 right-10 h-[90%] w-full max-w-md transform bg-white rounded-xl shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-50 flex flex-col`}
      >
        {/* Header */}
        <div className=" border-b px-6 py-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
              {user.isActive !== undefined && (
                <span
                  className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close profile panel"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mt-1 space-x-2">
            {user.pillStatus !== undefined && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user.pillStatus === "Filled"
                    ? "bg-green-100 text-green-700"
                    : user.pillStatus === "In Progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.pillStatus}
              </span>
            )}
            {/* Last active date */}
            {user.lastActive && (
              <span className="text-sm text-gray-500 mt-1">
                {new Date(user.lastActive).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pt-4 space-y-2">
          {/* User Info */}
          <div className="space-y-4 justify-items-center ">
            <img
              src={user.avatarUrl || "/"}
              onError={(e) =>
                (e.currentTarget.src = `https://placehold.co/50x50/4A90E2/FFFFFF?text=${user?.firstname.slice(
                  0,
                  2
                )}`)
              }
              alt={user.firstname}
              className="h-20 w-20 rounded-full object-cover border-2 border-primary"
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {user?.firstname} {user?.lastname}
              </h3>
              <p className="text-sm text-gray-500">
                Patient ID: {user.patientId}
              </p>
            </div>
          </div>

          {/* Pill History */}
          <h4 className="text-md font-semibold text-gray-700 mb-3">
            Fill History
          </h4>
          <div
            className="overflow-y-auto h-80  invisible-scrollbar

            "
          >
            <div className="space-y-3 mx-1">
              {fillLoading ? (
                <div className="text-center text-gray-500">
                  Loading history...
                </div>
              ) : Array.isArray(fillHistory?.data) &&
                fillHistory.data.length > 0 ? (
                fillHistory.data.map((item: any) => (
                  <div
                    key={item.date + item.status}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {item.date}
                      </p>
                      {item.status && (
                        <p
                          className={`text-xs ${getFillStatutColor(
                            item.status
                          ).replace("bg-", "text-")}`}
                        >
                          {item.status}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`block h-2.5 w-2.5 rounded-full ${getFillStatutColor(
                          item.status
                        )}`}
                      ></span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400">
                  No fill history found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Send Reminder */}
        <div className="p-6 space-y-4" key={user.id}>
          <textarea
            className="w-full h-24 p-3 border rounded-lg focus:ring-primary focus:border-primary  focus:outline-none"
            placeholder="Add a note..."
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button
            variant="primary"
            className="w-full"
            onClick={() => onSendReminder(user.id, note)}
            leftIcon={<Bell size={18} />}
          >
            {isSending ? "Sending..." : "Send Reminder"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
