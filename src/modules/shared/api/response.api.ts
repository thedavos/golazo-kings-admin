export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  errors: string[] | null;
  data: T;
}
