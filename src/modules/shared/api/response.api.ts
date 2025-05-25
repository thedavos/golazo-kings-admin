export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  errors: string[] | null;
  data: T;
}
