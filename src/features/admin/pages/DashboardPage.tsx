import React, { useState } from "react";
import Card from "../../../components/common/Card";
import {
  ArrowUpRight,
  UserRound,
  UserPlus,
  UserCheck,
  UserRoundX,
  ArrowDownRight,
  X,
} from "lucide-react";
import HistoryTable from "../../../components/common/HistoryTable";
import Header from "../../../components/layout/Header";
import Search from "../../../components/common/Search";
import ActivityCard from "../../../components/chart/ActivityCard";
import {
  useGetAdminsQuery,
  useGetDashboardStatsQuery,
} from "../../../services/admin/adminApi";

import { useGetUsersWithFiltersQuery } from "../../../services/users/userApi";
const ITEMS_PER_PAGE = 5;
type StatCardProps = {
  title: string;
  value: number | string;
  percentage?: string | number;
  trend: string | "up" | "down";
  icon: React.ReactElement<{ size?: number }>;
  bgColor?: string;
};

const StatCard = ({
  title,
  value,
  percentage,
  trend,
  icon,
  bgColor = "bg-blue-500",
}: StatCardProps) => {
  const trendColor = trend === "up" ? "text-green-500" : "text-red-500";
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="flex-1">
      <div className="flex items-center justify-between">
        {/* <div className={`p-3 rounded-full ${bgColor} text-white`}> */}
        <div className={`p-3 rounded-lg border text-primary `}>
          {React.cloneElement(icon, { size: 24 })}
        </div>

        <div>
          {percentage && (
            <p className={`text-xs ${trendColor} flex items-center flex-wrap`}>
              <TrendIcon size={14} className="mr-1" />
              {Number(percentage).toFixed(2) + "%"}
              <span className="ml-1 text-gray-700">vs last week</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 mt-4 space-y-2">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </Card>
  );
};

const DashboardPage = () => {
  // const { data } = useGetAdminsQuery();
  const { data, isLoading } = useGetDashboardStatsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    error: usersError,
  } = useGetUsersWithFiltersQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // console.log("usersResponse", usersResponse?.data);
  // console.log("pagination", usersResponse?.data?.pagination?.totalItems);
  // console.log("data", data);
  const handleSearch = (value: string) => {
    // Handle search change logic here
    setSearchTerm(value);
    // alert(`Searching for: ${value}`);
    handlePageChange(1); // reset to first page on new search
  };

  const handleClearSearch = () => {
    setSearchTerm(""); // Clear the search term
    handlePageChange(1); // Reset page to 1
  };

  const usersToDisplay = (usersResponse?.data?.data || []).map((user: any) => ({
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
  // const totalUsers = usersResponse?.data?.pagination?.totalItems || 0;

  return (
    <>
      <Header
        searchBar={<Search onSearch={handleSearch} initialValue={searchTerm} />}
      >
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </Header>

      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600 flex items-center space-x-2">
          <span>Filters:</span>
          <span className="flex items-center space-x-1 bg-gray-200 px-2 py-1 rounded-full">
            🔍 Search: <strong>{searchTerm}</strong>
            <button
              onClick={handleClearSearch}
              className="ml-1 p-0.5 rounded-full hover:bg-gray-300"
              aria-label="Clear search filter"
            >
              <X size={14} />
            </button>
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total User"
            value={data?.totalRegisteredUsers.count || 0}
            percentage={data?.totalRegisteredUsers.percentageChange || 0}
            trend={
              (data?.totalRegisteredUsers.percentageChange || 0) >= 0
                ? "up"
                : "down"
            }
            icon={<UserRound />}
            bgColor="bg-sky-500"
          />

          <StatCard
            title="New User"
            value={data?.newRegisteredUsers.count || 0}
            percentage={data?.newRegisteredUsers.percentageChange || 0}
            trend={
              (data?.newRegisteredUsers.percentageChange || 0) >= 0
                ? "up"
                : "down"
            }
            icon={<UserPlus />}
            bgColor="bg-emerald-500"
          />

          {/* Active user will be those who log in daily while inactive users will be those who have not logged in for the past one week */}
          <StatCard
            title="Active User"
            value={data?.activeUsers.count || 0}
            percentage={data?.activeUsers.percentageChange || 0}
            trend={
              (data?.activeUsers.percentageChange || 0) >= 0 ? "up" : "down"
            }
            icon={<UserCheck />}
            bgColor="bg-amber-500"
          />

          <StatCard
            title="Inactive User"
            value={data?.inactiveUsers.count || 0}
            percentage={data?.inactiveUsers.percentageChange || 0}
            trend={
              (data?.inactiveUsers.percentageChange || 0) >= 0 ? "up" : "down"
            }
            icon={<UserRoundX />}
            bgColor="bg-red-500"
          />
        </div>

        {/* Log Activity Section */}
        <ActivityCard />
        {/* Users Table Section */}
        <Card title="Users">
          {isUsersLoading ? (
            <p className="p-4">Loading users...</p>
          ) : usersError ? (
            <p className="p-4 text-red-500">Failed to load users.</p>
          ) : (
            <HistoryTable
              mode="user"
              histories={usersHistories}
              itemsPerPage={ITEMS_PER_PAGE}
              pagination={usersResponse?.data?.pagination}
              currentPage={currentPage}
              onSetCurrentPage={handlePageChange}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;
