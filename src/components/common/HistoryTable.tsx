import { useState } from "react";
import Pagination from "./Pagination";
import { Database, EllipsisVertical, FolderClock } from "lucide-react";
import type { User, UserHealthLog } from "../../types";

type TableMode = "user" | "data";
interface paginationProps {
  currentPage: string;
  hasNextPage: boolean;
  pageSize: string;
  totalItems: number;
  totalPages: number;
}
interface Props {
  mode?: TableMode;
  histories: User[] | UserHealthLog[];
  onActionClick?: (action: string, userId: string) => void;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  pagination: paginationProps;
  currentPage: number;
  onSetCurrentPage: ( page: number) => void;
  // currentPage?: number;
  // totalItems?: number;
}

// Format the status string to a more readable format
// e.g., "not_filled" -> "Not Filled"
function formatStatus(status: string): string {
  if (!status) return "";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function HistoryTable({
  mode = "user",
  histories,
  onActionClick,
  itemsPerPage = 6,
  pagination,
  currentPage = 1,
  onSetCurrentPage,
}: Props) {
  // const [currentPage, setCurrentPage] = useState(1);
  const [dropdownVisibleId, setDropdownVisibleId] = useState<string | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const safeHistories = Array.isArray(histories) ? histories : [];
  // const itemsPerPage = 6;

  // const currentHistories = useMemo(() => {
  //   const start = (currentPage - 1) * itemsPerPage;
  //   return histories.slice(start, start + itemsPerPage);
  // }, [currentPage, histories, itemsPerPage]);

  const truncateId = (id: string) =>
    id?.length <= 8 ? id : `${id?.slice(0, 6)}...${id?.slice(-4)}`;

  const toggleDropdown = (id: string) => {
    setDropdownVisibleId((prev) => (prev === id ? null : id));
  };

  const handleActionClick = (action: string, userId: string) => {
    onActionClick?.(action, userId);
    setDropdownVisibleId(null);
  };

  // Handle the header checkbox click (Select/Deselect all for current page)
  const handleHeaderCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      const newSelectedItems = new Set(
        safeHistories.map((entry: any) => entry.id)
      );
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems(new Set());
    }
  };

  // Handle individual row checkbox change
  const handleRowCheckboxChange = (id: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  return (
    <>
      <div className="overflow-x-auto w-full mt-4">
        {dropdownVisibleId && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setDropdownVisibleId(null)}
            aria-hidden="true"
          ></div>
        )}
        <table className="min-w-[800px] w-full border-collapse rounded-md border bg-white">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              {mode === "user" ? (
                <>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={safeHistories.every((entry: any) =>
                        selectedItems.has(entry.id)
                      )}
                      onChange={handleHeaderCheckboxChange}
                    />
                  </th>
                  <th className="p-5 font-semibold">Name</th>
                  <th className="p-5 font-semibold">Patient ID</th>
                  <th className="p-5 font-semibold">Last Active</th>
                  <th className="p-5 font-semibold">Reminder</th>
                  <th className="p-5 font-semibold">Status</th>
                  {onActionClick && (
                    <th className="p-5 font-semibold text-center">Actions</th>
                  )}
                </>
              ) : (
                <>
                  <th className="p-5 font-semibold">Date</th>
                  <th className="p-5 font-semibold">Glucose</th>
                  <th className="p-5 font-semibold">Water</th>
                  <th className="p-5 font-semibold">Meal</th>
                  <th className="p-5 font-semibold">Heart Rate</th>
                  <th className="p-5 font-semibold">Exercise</th>
                  <th className="p-5 font-semibold">Sleep</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {safeHistories.map((entry: any, index: number) => (
              <tr key={entry.id || index} className="border-t relative text-sm">
                {mode === "user" ? (
                  <>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={selectedItems.has(entry.id)}
                        onChange={() => handleRowCheckboxChange(entry.id)}
                      />
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <img
                        src={entry.avatarUrl || "/"}
                        alt="Profile"
                        onError={(e) =>
                          (e.currentTarget.src = `https://placehold.co/50x50/4A90E2/FFFFFF?text=${entry.firstname.slice(
                            0,
                            2
                          )}`)
                        }
                        className="h-10 w-10 rounded-full"
                      />
                      <span className="text-sm font-medium">
                        {entry.firstname} {entry.lastname}
                      </span>
                    </td>
                    <td className="p-4">
                      {entry.patientId
                        ? truncateId(entry.patientId)
                        : "No Patient ID"}
                    </td>
                    <td className="p-4">
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(entry.lastActive))}
                    </td>
                    <td className="p-4">
                      {/* {entry.reminderStatus} */}
                      {formatStatus(entry.reminderStatus)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          entry.status === "filled"
                            ? "bg-green-200 text-green-800"
                            : entry.status === "in_progress"
                            ? "bg-yellow-200 text-yellow-800"
                            : entry.status === "not_filled"
                            ? "bg-red-200 text-red-800"
                            : "bg-gray-300 text-gray-800"
                        }`}
                      >
                        {/* {entry.status} */}
                        {formatStatus(entry.status)}
                      </span>
                    </td>
                    {onActionClick && (
                      <td className="p-4 text-center">
                        <button onClick={() => toggleDropdown(entry.id)}>
                          <EllipsisVertical size={20} />
                        </button>
                        {dropdownVisibleId === entry.id && (
                          <div
                            className={`absolute z-20 w-36 bg-white border shadow-lg rounded-md right-0
                              ${ safeHistories?.length > 2 ?
                                index === safeHistories?.length - 1 ||
                                index === safeHistories?.length - 2
                                  ? "bottom-full mb-2"
                                  : "top-full mt-2"
                                  : "bottom-full -mb-6"
                              }
                            `}
                          >
                            <ul className="py-2 text-sm font-semibold text-gray-700">
                              <li>
                                <button
                                  onClick={() =>
                                    handleActionClick("viewProfile", entry.id)
                                  }
                                  className="flex gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                  <FolderClock size={20} />
                                  View Profile
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() =>
                                    handleActionClick("viewData", entry.id)
                                  }
                                  className="flex gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                  <Database size={20} />
                                  View Data
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </td>
                    )}
                  </>
                ) : (
                  <>
                    <td className="p-5">{entry.date}</td>
                    <td className="p-5">{entry.glucose}</td>
                    <td className="p-5">{entry.water}</td>
                    <td className="p-5">{entry.food}</td>
                    <td className="p-5">{entry.heartRate}</td>
                    <td className="p-5">{entry.exercise}</td>
                    <td className="p-5">{entry.sleep}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination
          // totalItems={safeHistories.length}
          itemsPerPage={itemsPerPage}
          // totalPages={pagination.totalPages}
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={onSetCurrentPage}
        />
      </div>
    </>
  );
}
