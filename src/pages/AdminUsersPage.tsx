import { useEffect, useState } from 'react';
import { Table, Tag, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getAllUsers } from '../api/admin';
import type { User } from '../api/types';

const { Title } = Typography;

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '获取用户列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns: ColumnsType<User> = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? 'red' : 'blue'}>{role}</Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: string) => new Date(value).toLocaleString(),
        },
    ];

    return (
        <div>
            <Title level={4} style={{ marginBottom: 16 }}>
                用户管理（Admin）
            </Title>
            <Table<User>
                rowKey="id"
                columns={columns}
                dataSource={users}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}
