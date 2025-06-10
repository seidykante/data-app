import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ActivityLogPoint } from "../../types";

interface ActivityChartProps {
  data: ActivityLogPoint[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 text-gray-500">
        No activity data available.
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e0e0e0"
            vertical={false}
          />{" "}
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            dy={10} // Pushes X-axis labels down a bit
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              borderColor: "#E5E7EB",
            }}
            itemStyle={{ color: "#1F2937" }}
            labelStyle={{ color: "#4B5563", fontWeight: "bold" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="uv"
            stroke="#3B82F6"
            strokeWidth={2.5}
            dot={{
              stroke: "#3B82F6",
              strokeWidth: 2,
              r: 4,
              fill: "#FFFFFF",
            }}
            activeDot={{
              r: 6,
              stroke: "#3B82F6",
              strokeWidth: 2,
              fill: "#FFFFFF",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
