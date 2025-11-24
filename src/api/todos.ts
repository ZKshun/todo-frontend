import api from './client';
import type { ApiBaseResponse, Todo } from './types';

export async function getTodos(): Promise<Todo[]> {
    const res = await api.get<ApiBaseResponse<Todo[]>>('/todos');
    return res.data.data;
}

export async function createTodo(title: string): Promise<Todo> {
    const res = await api.post<ApiBaseResponse<Todo>>('/todos', { title });
    return res.data.data;
}

export async function updateTodo(
    id: string,
    payload: Partial<Pick<Todo, 'title' | 'completed'>>
): Promise<Todo> {
    const res = await api.put<ApiBaseResponse<Todo>>(`/todos/${id}`, payload);
    return res.data.data;
}

export async function deleteTodo(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
}
