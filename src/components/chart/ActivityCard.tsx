import React, { useState } from "react";
import type { ActivityLogPoint } from "../../types";
import Card from "../common/Card";
import { sampleActivityData } from "../../pages/_mockData";
import ActivityChart from "./ActivityChart";

const ActivityCard: React.FC = () => {
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("daily");

  const filteredData: ActivityLogPoint[] = sampleActivityData[filter];

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
          <option value="weekly">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <ActivityChart data={filteredData} />
    </Card>
  );
};

export default ActivityCard;
