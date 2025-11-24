import api from './client';
import type { ApiBaseResponse, User } from './types';

export async function getAllUsers(): Promise<User[]> {
  const res = await api.get<ApiBaseResponse<User[]>>('/admin/users');
  return res.data.data;
}
