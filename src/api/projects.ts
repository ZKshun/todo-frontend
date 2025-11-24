import api from './client';
import type { ApiBaseResponse, Project } from './types';

export async function getProjects(): Promise<Project[]> {
    const res = await api.get<ApiBaseResponse<Project[]>>('/projects');
    return res.data.data;
}

export async function createProject(payload: {
    name: string;
    description?: string | null;
    color?: string | null;
}): Promise<Project> {
    const res = await api.post<ApiBaseResponse<Project>>('/projects', payload);
    return res.data.data;
}

export async function updateProject(
    id: string,
    payload: {
        name?: string;
        description?: string | null;
        color?: string | null;
    }
): Promise<Project> {
    const res = await api.put<ApiBaseResponse<Project>>(`/projects/${id}`, payload);
    return res.data.data;
}

export async function deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
}
