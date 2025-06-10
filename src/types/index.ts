export interface FillHistoryItem {
  id: string;
  date: string; // e.g., "Today", "Yesterday", "12/05/2025"
  status: "Logged" | "Missed" | "Not yet";
}

export interface UserHealthLog {
  id: string;
  date: string; // e.g., "27/06/2024"
  glucose: string;
  water: string;
  meal: string;
  heartRate: string;
  exercise: string;
  sleep: string;  // 8h 30m
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatarUrl?: string;
  patientId: string;
  lastActive: string;
  reminderStatus: "Sent" | "Not Sent";
  pillStatus: "Filled" | "Not Filled" | "In Progress";
  isActive?: boolean; 
  fiillHistory?: FillHistoryItem[];
  healthLogs?: UserHealthLog[];
}

export interface ActivityLogPoint {
  name: string; // X-axis label e.g., "7 am", "8 am", "9 am"
  uv: number; // Y-axis value, 'uv' is a common key in charting libraries
}


export interface PaginatedUsersResponse {
  data: User[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface FillHistory {
  date: string;
  fillLevel: number;
}

export interface UserLogs {
  timestamp: string;
  action: string;
  detail: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  code?: number;
  data: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    token: string;
  };
}

export interface RegisterResponse {
  success?: boolean;
  message?: string;
  data: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
}

export interface DashboardStats {
  activeUsers: { count: number; percentageChange: number };
  inactiveUsers: { count: number; percentageChange: number };
  newRegisteredUsers: { count: number; percentageChange: number };
  totalRegisteredUsers: { count: number; percentageChange: number };
  recentUsers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    lastActive: string;
    status: string;
  }[];
}

export interface ActivityLogQuery {
  type?: "daily" | "weekly" | "monthly";
  date?: string;
  week?: string;
}