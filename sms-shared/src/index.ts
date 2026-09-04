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
