import { api } from 'boot/axios';
import type { ApiResponse } from './response.api';

export class ApiClient {
  private baseURL = '';

  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.get(`${this.baseURL}${endpoint}`, {
        params,
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async post<T>(endpoint: string, data?: any, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(`${this.baseURL}${endpoint}`, data, {
        params,
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.put(`${this.baseURL}${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch(`${this.baseURL}${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete(`${this.baseURL}${endpoint}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.errors) {
      return new Error(error.response.data.errors.join(', '));
    }
    return new Error(error.message || 'Error en la petición');
  }
}
