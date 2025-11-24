import { useEffect, useState } from 'react';
import { Button, Checkbox, Input, List, message, Typography, Space } from 'antd';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todos';
import type { Todo } from '../api/types';

const { Title } = Typography;

export default function TodosPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const data = await getTodos();
            setTodos(data);
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '获取 Todo 失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleCreate = async () => {
        if (!newTitle.trim()) return;
        setCreating(true);
        try {
            const todo = await createTodo(newTitle.trim());
            setTodos((prev) => [todo, ...prev]);
            setNewTitle('');
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '创建失败');
        } finally {
            setCreating(false);
        }
    };

    const toggleCompleted = async (todo: Todo) => {
        try {
            const updated = await updateTodo(todo.id, { completed: !todo.completed });
            setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '更新失败');
        }
    };

    const handleDelete = async (todo: Todo) => {
        try {
            await deleteTodo(todo.id);
            setTodos((prev) => prev.filter((t) => t.id !== todo.id));
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '删除失败');
        }
    };

    return (
        <div>
            <Title level={4} style={{ marginBottom: 16 }}>
                我的待办
            </Title>

            <Space style={{ marginBottom: 16 }} align="start">
                <Input
                    placeholder="输入待办事项..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onPressEnter={handleCreate}
                    style={{ width: 320 }}
                />
                <Button type="primary" onClick={handleCreate} loading={creating}>
                    添加
                </Button>
            </Space>

            <List
                bordered
                loading={loading}
                dataSource={todos}
                locale={{ emptyText: '暂无待办事项' }}
                renderItem={(todo) => (
                    <List.Item
                        actions={[
                            <a key="delete" onClick={() => handleDelete(todo)}>
                                删除
                            </a>,
                        ]}
                    >
                        <Checkbox
                            checked={todo.completed}
                            onChange={() => toggleCompleted(todo)}
                            style={{ marginRight: 8 }}
                        />
                        <span style={todo.completed ? { textDecoration: 'line-through', color: '#999' } : {}}>
                            {todo.title}
                        </span>
                    </List.Item>
                )}
            />
        </div>
    );
}
