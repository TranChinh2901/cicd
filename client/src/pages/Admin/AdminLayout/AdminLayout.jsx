import { useState } from 'react';
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  TeamOutlined,
  AppstoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  BackwardOutlined,
  TagsOutlined,
  GlobalOutlined,
  FileTextOutlined,
  TrademarkCircleOutlined,
} from '@ant-design/icons';
import { MdOutlineDeliveryDining } from "react-icons/md";
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, theme } from 'antd';
import styles from './AdminLayout.module.css';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MdOutlineArrowDropDown } from "react-icons/md";
import { MdShoppingCartCheckout } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import { CgProfile } from "react-icons/cg";
import { RiNotification3Line } from "react-icons/ri";
import { MdOutlineComment } from "react-icons/md";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const AdminLayout = () => {
  const [auth] = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: 'brands-management',
      icon: <TrademarkCircleOutlined />,
      label: 'QL Ngôn ngữ LT',
      children: [
        {
          key: '/admin/brands/view',
          icon: <FileSearchOutlined />,
          label: <Link to="/admin/brands/view">Xem thông tin</Link>,
        },
        {
          key: '/admin/brands/create',
          icon: <PlusOutlined />,
          label: <Link to="/admin/brands/create">Tạo mới</Link>,
        },
        {
          key: '/admin/brands/edit',
          icon: <EditOutlined />,
          label: <Link to="/admin/brands/edit">Chỉnh sửa </Link>,
        },
        {
          key: '/admin/brands/delete',
          icon: <DeleteOutlined />,
          label: <Link to="/admin/brands/delete">Xóa </Link>,
        },
      ],
    },
    {
      key: 'category-management',
      icon: <TagsOutlined />,
      label: 'QL danh mục',
      children: [
        {
          key: '/admin/categories/view',
          icon: <FileSearchOutlined />,
          label: <Link to="/admin/categories/view">Xem thông tin </Link>,
        },
        {
          key: '/admin/categories/create',
          icon: <PlusOutlined />,
          label: <Link to="/admin/categories/create">Tạo mới </Link>,
        },
        {
          key: '/admin/categories/edit',
          icon: <EditOutlined />,
          label: <Link to="/admin/categories/edit">Chỉnh sửa </Link>,
        },
        {
          key: '/admin/categories/delete',
          icon: <DeleteOutlined />,
          label: <Link to="/admin/categories/delete">Xóa </Link>,
        },
      ],
    },
    {
      key: 'languages-management',
      icon: <GlobalOutlined />,
      label: 'QL bài học',
      children: [
        {
          key: '/admin/languages/view',
          icon: <FileSearchOutlined />,
          label: <Link to="/admin/languages/view">Xem thông tin </Link>,
        },
        {
          key: '/admin/languages/create',
          icon: <PlusOutlined />,
          label: <Link to="/admin/languages/create">Tạo mới </Link>,
        },
        {
          key: '/admin/languages/edit',
          icon: <EditOutlined />,
          label: <Link to="/admin/languages/edit">Chỉnh sửa </Link>,
        },
        {
          key: '/admin/languages/delete',
          icon: <DeleteOutlined />,
          label: <Link to="/admin/languages/delete">Xóa </Link>,
        },
      ],
    },
    {
      key: 'blog-management',
      icon: <FileTextOutlined />,
      label: 'Quản lý Blogs',
      children: [
        {
          key: '/admin/blogs/view',
          icon: <FileSearchOutlined />,
          label: <Link to="/admin/blogs/view">Xem thông tin </Link>,
        },
        {
          key: '/admin/blogs/create',
          icon: <PlusOutlined />,
          label: <Link to="/admin/blogs/create">Tạo mới </Link>,
        },
        {
          key: '/admin/blogs/edit',
          icon: <EditOutlined />,
          label: <Link to="/admin/blogs/edit">Chỉnh sửa </Link>,
        },
        {
          key: '/admin/blogs/delete',
          icon: <DeleteOutlined />,
          label: <Link to="/admin/blogs/delete">Xóa </Link>,
        },
      ]
    },
    {
      key: 'user-accounts-management',
      icon: <TeamOutlined />,
      label: 'QL Members',
      children: [
        {
          key: '/admin/users/view',
          icon: <FileSearchOutlined />,
          label: <Link to="/admin/users/view">Xem thông tin </Link>,
        },

        {
          key: '/admin/users/delete',
          icon: <DeleteOutlined />,
          label: <Link to="/admin/users/delete">Xóa </Link>,
        },
      ]
    },
    {
      key: '/',
      icon: <BackwardOutlined />,
      label: <Link to="/">Về trang chủ</Link>,
    },
  ];

  const dropdownMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/admin/profile" style={{ textDecoration: 'none' }}><CgProfile style={{ fontSize: '16px', marginTop: '-3px' }} /> Profile </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/" style={{ textDecoration: 'none' }}><MdLogout /> Về trang chủ </Link>
      </Menu.Item>
    </Menu>
  );

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
        >
          <Row>
            <Col md={20}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '20px',
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col md={4}>
              <Dropdown overlay={dropdownMenu} placement="bottomRight" arrow>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Avatar size="default" icon={<TeamOutlined />} />
                  <span style={{ marginLeft: 8 }}>{auth.user ? `${auth.user.name}` : "Tài khoản"}<MdOutlineArrowDropDown style={{ fontSize: '25px' }} /> </span>
                </div>
              </Dropdown>
            </Col>
          </Row>
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