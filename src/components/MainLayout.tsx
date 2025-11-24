import { Layout, Menu } from 'antd';
import { CheckSquareOutlined, ProjectOutlined, SettingOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MainLayout.scss';

const { Header, Content } = Layout;

export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        {
            key: 'todos',
            icon: <CheckSquareOutlined />,
            label: (
                <NavLink to="/" end>
                    Todos
                </NavLink>
            ),
        },
        {
            key: 'projects',
            icon: <ProjectOutlined />,
            label: (
                <NavLink to="/projects">
                    Projects
                </NavLink>
            ),
        },
        {
            key: 'activity',
            icon: <ClockCircleOutlined />,
            label: (
                <NavLink to="/activity">
                    Activity
                </NavLink>
            ),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: (
                <NavLink to="/settings">
                    Settings
                </NavLink>
            ),
        },
    ];

    if (user?.role === 'admin') {
        menuItems.push({
            key: 'admin-users',
            icon: <TeamOutlined />,
            label: (
                <NavLink to="/admin/users">
                    Admin
                </NavLink>
            ),
        });
    }

    return (
        <Layout className="app-layout">
            <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                <div className="app-header">
                    <div className="app-header__title">
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckSquareOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                            <span>Todo App</span>
                        </Link>
                    </div>

                    <Menu
                        mode="horizontal"
                        selectable={false}
                        style={{ borderBottom: 'none', flex: 1, marginLeft: 24 }}
                        items={menuItems}
                    />

                    <div className="app-header__right">
                        <span>{user?.username}</span>
                        <a onClick={handleLogout}>退出</a>
                    </div>
                </div>
            </Header>

            <Content className="app-main">
                <div className="app-content">
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
}
