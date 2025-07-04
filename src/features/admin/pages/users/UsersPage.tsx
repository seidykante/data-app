import { useEffect, useState } from "react";
import ProfilePanel from "../../../../components/users/ProfilePanel";
import type { User } from "../../../../types";
import DateRangePickerModal from "../../../../components/common/DateRangePickerModal";
import { Download, SlidersHorizontal, X } from "lucide-react";
import HistoryTable from "../../../../components/common/HistoryTable";
import Search from "../../../../components/common/Search";
import Header from "../../../../components/layout/Header";
import {
  useGetUsersWithFiltersQuery,
  useGetUserHealthLogsQuery,
  useSendReminderMutation,
} from "../../../../services/users/userApi";
import { skipToken } from "@reduxjs/toolkit/query";
const ITEMS_PER_PAGE = 8;
const ITEMS_PER_PAGE_LOGS = 10;

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentFilterDates, setCurrentFilterDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [viewingDataUser, setViewingDataUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch: refetchUser,
  } = useGetUsersWithFiltersQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm,
    startDate: currentFilterDates.startDate?.toISOString(),
    endDate: currentFilterDates.endDate?.toISOString(),
  });

  const users = usersResponse?.data?.data || [];

  const healthLogsQueryParams = viewingDataUser
    ? {
        userId: viewingDataUser.id,
        page: currentPage,
        limit: ITEMS_PER_PAGE_LOGS,
        search: searchTerm,
        startDate: currentFilterDates.startDate?.toISOString(),
        endDate: currentFilterDates.endDate?.toISOString(),
      }
    : skipToken;

  const {
    data: userLogsResponse,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchUserLogs,
  } = useGetUserHealthLogsQuery(healthLogsQueryParams);

  const userLogs = userLogsResponse?.data?.data || [];

  // console.log("userLogsResponse: ", userLogsResponse);
  // console.log("usersResponse: ", usersResponse);

  // console.log("Data logs pagination: ", userLogsResponse?.data?.pagination);

  useEffect(
    function () {
      const fetch = async function () {
        if (viewingDataUser) {
          await refetchUserLogs();
        } else await refetchUser();
      };
      fetch();
    },
    [currentPage, viewingDataUser]
  );

  // useEffect(
  //   function () {
  //     const fetch = async function () {
  //       // console.log("Fetching user logs for page:", currentPage);
  //       // console.log("Logs user", userLogsResponse.data?.data);
  //       await refetchUserLogs();
  //     };
  //     fetch();
  //   },
  //   [currentPage]
  // );

  // const {
  //   data: userLogs,
  //   isLoading: logsLoading,
  //   error: logsError,
  // } = useGetUserHealthLogsQuery(
  //   viewingDataUser
  //     ? { userId: viewingDataUser.id, page: 1, limit: 10 }
  //     : skipToken
  // );
  // console.log("userlog", userLogs?.data?.data);
  const [sendReminder, { isLoading: isSending }] = useSendReminderMutation();

  const handlePageChange = (page: number) => {
    // console.log("Changing page to:", page);
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    handlePageChange(1);
    // alert(`Searching for: ${value}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    handlePageChange(1); // Reset page to 1
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsProfilePanelOpen(true);
  };

  const handleCloseProfilePanel = () => {
    setIsProfilePanelOpen(false);
    setSelectedUser(null);
  };

  const handleSendReminder = async (userId: string, note?: string) => {
    try {
      await sendReminder({ userId, note }).unwrap();
      alert("Reminder sent successfully!");
    } catch (error) {
      alert("Failed to send reminder.");
      console.error(error);
    }
  };

  const handleApplyDateFilter = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    console.log("Selected period:", startDate, endDate);
    setCurrentFilterDates({ startDate, endDate });
    setCurrentPage(1);
    // Call RTK Query with new date filters or update local state for filtering
  };

  const handleClearDateFilter = () => {
    setCurrentFilterDates({ startDate: null, endDate: null });
    setCurrentPage(1);
  };

  const handleActionClick = (action: string, userId: string) => {
    if (action === "viewProfile") {
      const user = users.find((u: any) => u.id === userId);
      if (user) handleUserClick(user);
    } else if (action === "viewData") {
      const user = users.find((u: any) => u.id === userId);
      if (user) {
        setViewingDataUser(user);

        // When switching to viewing user data, reset search and filters
        setCurrentPage(1);
        setSearchTerm("");
        setCurrentFilterDates({ startDate: null, endDate: null });
      }
    }
  };

  // Export handler export itas .csv file
  const handleExport = () => {
    if (!users?.length) return;

    if (viewingDataUser) {
      console.log("Exporting health logs for user:", viewingDataUser);
      // Export health logs
      const logs = userLogs;
      if (!logs?.length) return;

      const headers = "Date,Glucose,Water,Meal,Heart Rate,Exercise,Sleep\n";
      const csvContent = logs
        .map(
          (log: any) =>
            `${log?.date},${log?.glucose},${log?.water},${log?.food},${log?.heartRate},${log?.exercise},${log?.sleep}`
        )
        .join("\n");

      const blob = new Blob([headers + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${viewingDataUser.firstname}_health_data.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Export users
      const headers =
        "ID,Name,Email,Patient ID,Last Active,Reminder Status,Pill Status\n";
      const csvContent = users
        .map(
          (user: any) =>
            `${user.id},${user.firstname},${user.email},${user.patientId},${
              user.lastActive
            },${user.reminderStatus || ""},${user.pillStatus}`
        )
        .join("\n");

      const blob = new Blob([headers + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // console.log("Users data:", users);
  // console.log("Users logs:", userLogs);

  // Filter users based on current filter
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.patientId.toLowerCase().includes(searchTerm.toLowerCase());

    if (!currentFilterDates.startDate || !currentFilterDates.endDate) {
      return matchesSearch;
    }

    const lastActiveDate = new Date(user.lastActive);
    const matchesDate =
      (!currentFilterDates.startDate ||
        lastActiveDate >= currentFilterDates.startDate) &&
      (!currentFilterDates.endDate ||
        lastActiveDate <= currentFilterDates.endDate);

    return matchesSearch && matchesDate;
  });

  const usersToDisplay = filteredUsers.map((user: any) => ({
    ...user,
    lastActive: new Date(user.lastActive).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));
  const usersHistories = usersToDisplay.map((user: any) => ({
    ...user,
    id: user.id,
  }));

  const filteredUserLogs =
    userLogs?.filter((log: any) => {
      const logDate = new Date(log.date);
      const matchesDate =
        (!currentFilterDates.startDate ||
          logDate >= currentFilterDates.startDate) &&
        (!currentFilterDates.endDate || logDate <= currentFilterDates.endDate);

      const logValues = Object.values(log).map(String).join(" ").toLowerCase();
      const matchesSearch = logValues.includes(searchTerm.toLowerCase());

      return matchesDate && matchesSearch;
    }) || [];

  return (
    <div>
      <Header>
        <div className="flex items-center space-x-2">
          <button onClick={() => setViewingDataUser(null)}>
            <h1 className="text-2xl font-semibold text-gray-800 hover:cursor-pointer">
              Users
            </h1>
          </button>
          {viewingDataUser ? (
            <span className="text-lg text-gray-500">
              {">> " + viewingDataUser?.firstname}
            </span>
          ) : (
            ""
          )}
        </div>
      </Header>

      {(searchTerm ||
        currentFilterDates.startDate ||
        currentFilterDates.endDate) && (
        <div className="mb-4 text-sm text-gray-600">
          <span>Filters:</span>
          {searchTerm && (
            <>
              <span>
                {" "}
                🔍 Search: <strong>{searchTerm}</strong>
              </span>
              <button
                onClick={handleClearSearch}
                className="ml-1 p-0.5 rounded-full hover:bg-gray-300"
                aria-label="Clear search filter"
              >
                <X size={14} />
              </button>
            </>
          )}
          {(currentFilterDates.startDate || currentFilterDates.endDate) && (
            <span className="flex items-center space-x-1 bg-gray-200 px-2 py-1 rounded-full">
              📅 From:{" "}
              <strong>
                {currentFilterDates.startDate?.toLocaleDateString()}
              </strong>{" "}
              To:{" "}
              <strong>
                {currentFilterDates.endDate?.toLocaleDateString()}
              </strong>
              <button
                onClick={handleClearDateFilter}
                className="ml-1 p-0.5 rounded-full hover:bg-gray-300"
                aria-label="Clear date filter"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="mt-10">
        <DateRangePickerModal
          isOpen={isDatePickerOpen}
          onClose={() => setIsDatePickerOpen(false)}
          onApply={handleApplyDateFilter}
          initialStartDate={currentFilterDates.startDate}
          initialEndDate={currentFilterDates.endDate}
        />

        {/* Filters & Export */}
        <div className="flex justify-between items-center my-4">
          <Search onSearch={handleSearch} initialValue={searchTerm} />
          <div className="flex space-x-4">
            <button
              className="border px-4 py-2 rounded-md flex items-center space-x-2"
              onClick={() => setIsDatePickerOpen((prev) => !prev)}
            >
              {/* Icon for date filter */}
              <SlidersHorizontal />
              <span>Date</span>
            </button>

            <button
              onClick={handleExport}
              className="border px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <Download />
              <span>Export </span>
            </button>
          </div>
        </div>

        {/* <HistoryTable
          histories={usersHistories}
          itemsPerPage={10}
          onActionClick={handleActionClick}
        /> */}
        {logsLoading ? (
          <div className="flex justify-center py-10 text-gray-500">
            Loading data...
          </div>
        ) : (
          <HistoryTable
            mode={viewingDataUser ? "data" : "user"}
            histories={viewingDataUser ? filteredUserLogs : usersHistories}
            itemsPerPage={
              viewingDataUser ? ITEMS_PER_PAGE_LOGS : ITEMS_PER_PAGE
            }
            // pagination={usersResponse?.data?.pagination}
            pagination={
              viewingDataUser
                ? userLogsResponse?.data?.pagination
                : usersResponse?.data?.pagination
            }
            onActionClick={handleActionClick}
            currentPage={currentPage}
            onSetCurrentPage={handlePageChange}
          />
        )}
      </div>

      {selectedUser && (
        <ProfilePanel
          user={selectedUser}
          isOpen={isProfilePanelOpen}
          onClose={handleCloseProfilePanel}
          onSendReminder={handleSendReminder}
          isSending={isSending}
        />
      )}
    </div>
  );
};

export default UsersPage;
