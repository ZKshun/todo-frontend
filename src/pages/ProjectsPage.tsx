import { useEffect, useState } from 'react';
import { Button, ColorPicker, Form, Input, List, Modal, message, Space, Tag, Typography, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects';
import type { Project } from '../api/types';

const { Title, Text } = Typography;

interface ProjectFormValues {
    name: string;
    description?: string;
    color?: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);
    const [form] = Form.useForm<ProjectFormValues>();

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '获取项目失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const openEditModal = (project: Project) => {
        setEditing(project);
        form.setFieldsValue({
            name: project.name,
            description: project.description ?? '',
            color: project.color ?? '#1677ff',
        });
        setModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload: ProjectFormValues = {
                name: values.name,
                description: values.description || undefined,
                color: values.color,
            };

            if (editing) {
                const updated = await updateProject(editing.id, payload);
                setProjects((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
                message.success('更新项目成功');
            } else {
                const created = await createProject(payload);
                setProjects((prev) => [created, ...prev]);
                message.success('创建项目成功');
            }

            setModalOpen(false);
            setEditing(null);
            form.resetFields();
        } catch (err: any) {
            if (err?.errorFields) return; // 表单校验错误
            message.error(err?.response?.data?.message ?? '操作失败');
        }
    };

    const handleDelete = async (project: Project) => {
        try {
            await deleteProject(project.id);
            setProjects((prev) => prev.filter((p) => p.id !== project.id));
            message.success('删除成功');
        } catch (err: any) {
            message.error(err?.response?.data?.message ?? '删除失败');
        }
    };

    return (
        <div>
            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                    项目列表
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    新建项目
                </Button>
            </Space>

            <List
                bordered
                loading={loading}
                dataSource={projects}
                locale={{ emptyText: '暂无项目' }}
                renderItem={(project) => (
                    <List.Item
                        actions={[
                            <Button
                                key="edit"
                                type="link"
                                icon={<EditOutlined />}
                                onClick={() => openEditModal(project)}
                            >
                                编辑
                            </Button>,
                            <Popconfirm
                                key="delete"
                                title="确认删除这个项目？"
                                onConfirm={() => handleDelete(project)}
                            >
                                <Button type="link" danger icon={<DeleteOutlined />}>
                                    删除
                                </Button>
                            </Popconfirm>,
                        ]}
                    >
                        <List.Item.Meta
                            title={
                                <Space>
                                    {project.color && <Tag color={project.color}>{/* color tag */}</Tag>}
                                    <Text strong>{project.name}</Text>
                                </Space>
                            }
                            description={project.description || '无描述'}
                        />
                    </List.Item>
                )}
            />

            <Modal
                open={modalOpen}
                title={editing ? '编辑项目' : '新建项目'}
                onOk={handleSubmit}
                onCancel={() => {
                    setModalOpen(false);
                    setEditing(null);
                }}
                destroyOnClose
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[{ required: true, message: '请输入项目名称' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="color" label="颜色">
                        {/* AntD v5 ColorPicker 值是 Color 对象或 string，这里简单用 string 模式 */}
                        <ColorPicker
                            defaultValue="#1677ff"
                            showText
                            onChangeComplete={(color) => {
                                form.setFieldsValue({ color: color.toHexString() });
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
