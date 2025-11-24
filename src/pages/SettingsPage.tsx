import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Select, Switch, message, Typography, Space } from 'antd';
import { getMySettings, updateMySettings } from '../api/settings';
import type { UserSettings } from '../api/types';

const { Title, Text } = Typography;

interface SettingsFormValues {
    language: string;
    timezone: string;
    notificationsEmail: boolean;
    notificationsInApp: boolean;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm<SettingsFormValues>();

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await getMySettings();
            setSettings(data);
            form.setFieldsValue({
                language: data.language,
                timezone: data.timezone,
                notificationsEmail: data.notifications.email,
                notificationsInApp: data.notifications.inApp,
            });
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '获取设置失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);
            const updated = await updateMySettings({
                language: values.language,
                timezone: values.timezone,
                notifications: {
                    email: values.notificationsEmail,
                    inApp: values.notificationsInApp,
                },
            });
            setSettings(updated);
            message.success('保存成功');
        } catch (err: any) {
            if (err?.errorFields) return;
            message.error(err?.response?.data?.message ?? '保存失败');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Title level={4} style={{ marginBottom: 16 }}>
                个人设置
            </Title>

            <Card loading={loading}>
                <Form layout="vertical" form={form}>
                    <Form.Item name="language" label="语言">
                        <Select
                            options={[
                                { value: 'zh-CN', label: '简体中文' },
                                { value: 'en-US', label: 'English' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="timezone" label="时区">
                        <Input placeholder="例如：Asia/Shanghai" />
                    </Form.Item>

                    <Form.Item label="通知设置">
                        <Space direction="vertical">
                            <Space>
                                <Switch
                                    checked={form.getFieldValue('notificationsEmail')}
                                    onChange={(checked) =>
                                        form.setFieldsValue({ notificationsEmail: checked })
                                    }
                                />
                                <Text>邮件通知</Text>
                            </Space>
                            <Space>
                                <Switch
                                    checked={form.getFieldValue('notificationsInApp')}
                                    onChange={(checked) =>
                                        form.setFieldsValue({ notificationsInApp: checked })
                                    }
                                />
                                <Text>站内通知</Text>
                            </Space>
                        </Space>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={handleSave} loading={saving}>
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
