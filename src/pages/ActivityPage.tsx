import { useEffect, useState } from 'react';
import { List, Tag, Typography, message } from 'antd';
import { getMyActivities } from '../api/activity';
import type { ActivityItem } from '../api/types';

const { Title, Text } = Typography;

export default function ActivityPage() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getMyActivities(50);
            setActivities(data);
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '获取活动失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Title level={4} style={{ marginBottom: 16 }}>
                活动记录
            </Title>

            <List
                bordered
                loading={loading}
                dataSource={activities}
                locale={{ emptyText: '暂无活动记录' }}
                renderItem={(item) => (
                    <List.Item>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Tag color="blue">{item.type}</Tag>
                                <Text>{item.message}</Text>
                            </div>
                            <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
                                {new Date(item.createdAt).toLocaleString()}
                            </Text>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
}
