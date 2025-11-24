import api from './client';
import type { ApiBaseResponse, ActivityItem } from './types';

export async function getMyActivities(limit = 20): Promise<ActivityItem[]> {
    const res = await api.get<ApiBaseResponse<ActivityItem[]>>('/activity/me', {
        params: { limit },
    });
    return res.data.data;
}
