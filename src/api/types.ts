export type Role = 'user' | 'admin';

export interface ApiBaseResponse<T = unknown> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}

export interface User {
    id: string;
    username: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    name: string;
    description?: string | null;
    color?: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserSettings {
    id: string;
    userId: string;
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        inApp: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ActivityItem {
    id: string;
    userId: string;
    type: string;
    message: string;
    meta?: Record<string, unknown> | null;
    createdAt: string;
}
