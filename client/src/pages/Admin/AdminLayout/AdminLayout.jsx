import { useState } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  BookOutlined,
  TagOutlined,
  BackwardOutlined
} from '@ant-design/icons';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './AdminLayout.module.css';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [auth, setAuth] = useAuth();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    setAuth({
      user: null,
      token: ""
    });
    localStorage.removeItem('auth');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: '/admin/brand-languages',
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/brand-languages">Brand Languages</Link>,
    },
    {
      key: '/admin/category-languages',
      icon: <TagOutlined />,
      label: <Link to="/admin/category-languages">Category Languages</Link>,
    },
    {
      key: '/admin/languages',
      icon: <BookOutlined />,
      label: <Link to="/admin/languages">Languages</Link>,
    },
    {
      key: '/admin/blog-languages',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/blog-languages">Blog Languages</Link>,
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: '/',
      //icon back to home 
      icon: <BackwardOutlined/>,
      label: <Link to="/">Back home</Link>,
    },
  ];

  return (
    <Layout className={styles.adminLayout}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className={styles.sider}
      >
        <div className={styles.logo}>
          <img src="https://the-algorithms.com/images/logo.svg" alt="Logo" />
          {!collapsed && <span>Admin Panel</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
          className={styles.header}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              {collapsed ? (
                <MenuUnfoldOutlined
                  className={styles.trigger}
                  onClick={() => setCollapsed(!collapsed)}
                />
              ) : (
                <MenuFoldOutlined
                  className={styles.trigger}
                  onClick={() => setCollapsed(!collapsed)}
                />
              )}
            </div>
            <div className={styles.headerRight}>
              <Dropdown
                menu={{
                  items: userMenuItems,
                }}
                placement="bottomRight"
              >
                <Space className={styles.userInfo}>
                  <Avatar icon={<UserOutlined />} />
                  <span>{auth?.user?.name}</span>
                </Space>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className={styles.content}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;