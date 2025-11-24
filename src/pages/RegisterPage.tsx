import { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            await register(values.username, values.password);
            message.success('注册成功，请登录');
            navigate('/login');
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '注册失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
            }}
        >
            <Card style={{ width: 360 }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                    注册
                </Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input autoComplete="username" />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码' },
                            { min: 6, message: '至少 6 位' },
                        ]}
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            注册
                        </Button>
                    </Form.Item>
                </Form>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    已有账号？ <Link to="/login">去登录</Link>
                </Text>
            </Card>
        </div>
    );
}
