export type ErrorCode = string;

export interface ApiError {
  code: ErrorCode;
  message: string;
}

export interface ErrorEnvelope {
  error: ApiError;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  database: "connected" | "disconnected";
  timestamp: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserDTO {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "TEACHER" | "STUDENT";
}

export interface LoginResponse {
  data: { user: UserDTO };
}

// --- Teacher Dashboard ---

export interface TodayClass {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  studentCount: number;
}

export interface DashboardResponse {
  data: { classes: TodayClass[] };
}

// --- Class Detail ---

export interface ClassDetailStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId?: string;
}

export interface ClassSchedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface ClassDetailDTO {
  id: string;
  name: string;
  teacherName?: string;
  schedules: ClassSchedule[];
  studentCount: number;
  students: ClassDetailStudent[];
}

export interface ClassDetailResponse {
  data: { class: ClassDetailDTO };
}

