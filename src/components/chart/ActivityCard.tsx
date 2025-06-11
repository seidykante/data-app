import React, { useState } from "react";
import type { ActivityLogPoint } from "../../types";
import Card from "../common/Card";
// import { sampleActivityData } from "../../pages/_mockData";
import ActivityChart from "./ActivityChart";
import { useGetActivityLogsQuery } from "../../services/admin/adminApi";

const ActivityCard: React.FC = () => {
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("daily");

  const {
    data: activityData,
    isLoading,
    error,
  } = useGetActivityLogsQuery({
    type: filter,
  });

  const getLabels = () => {
    if (filter === "daily") return [...Array(24)].map((_, i) => `${i}:00`);
    if (filter === "weekly")
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    if (filter === "monthly")
      return [...Array(30)].map((_, i) => `Day ${i + 1}`);
    return [];
  };

  const transformedData: ActivityLogPoint[] =
    activityData?.data?.map((value: number, index: number) => ({
      name: getLabels()[index] ?? `#${index + 1}`,
      uv: value,
    })) || [];

  return (
    <Card title="Log Activity">
      <div className="flex items-center justify-end mb-4">
        <select
          className="border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "daily" | "weekly" | "monthly")
          }
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-52 text-gray-500">
          Loading activity data...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-52 text-red-500">
          Failed to load activity data.
        </div>
      ) : (
        <ActivityChart data={transformedData} />
      )}
    </Card>
  );
};

export default ActivityCard;
