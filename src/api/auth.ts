import api from './client';
import type { ApiBaseResponse, AuthTokens, User } from './types';

export async function login(username: string, password: string): Promise<AuthTokens> {
    const res = await api.post<ApiBaseResponse<AuthTokens>>('/auth/login', {
        username,
        password,
    });
    return res.data.data;
}

export async function register(username: string, password: string): Promise<User> {
    const res = await api.post<ApiBaseResponse<User>>('/auth/register', {
        username,
        password,
    });
    return res.data.data;
}

export async function getMe(): Promise<User> {
    const res = await api.get<ApiBaseResponse<User>>('/auth/me');
    return res.data.data;
}
