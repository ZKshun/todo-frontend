import api from './client';
import type { ApiBaseResponse, UserSettings } from './types';

export async function getMySettings(): Promise<UserSettings> {
    const res = await api.get<ApiBaseResponse<UserSettings>>('/settings/me');
    return res.data.data;
}

export async function updateMySettings(
    payload: Partial<Pick<UserSettings, 'language' | 'timezone' | 'notifications'>>
): Promise<UserSettings> {
    const res = await api.put<ApiBaseResponse<UserSettings>>('/settings/me', payload);
    return res.data.data;
}
