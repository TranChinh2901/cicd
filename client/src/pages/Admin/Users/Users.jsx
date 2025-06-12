import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  // Modal, // Loại bỏ Modal vì không dùng cho sửa
  // Form, // Loại bỏ Form vì không dùng cho sửa
  // Input, // Loại bỏ Input vì không dùng cho sửa
  Space,
  Popconfirm,
  message,
  Card,
  Tag,
  Select,
  Avatar,
  Tooltip
} from 'antd';
import {
  // EditOutlined, // Loại bỏ EditOutlined vì không dùng chức năng sửa
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import styles from './Users.module.css'; // Đảm bảo bạn có file CSS này

const API_URL = import.meta.env.VITE_API;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false); // Loại bỏ state này
  // const [editingUser, setEditingUser] = useState(null); // Loại bỏ state này
  // const [form] = Form.useForm(); // Loại bỏ hook này

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/auth/users`);
      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Loại bỏ handleSubmit vì không còn chức năng cập nhật

  // Loại bỏ handleEdit vì không còn chức năng cập nhật

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${API_URL}/api/v1/auth/users/${userId}`);
      message.success('Xóa người dùng thành công');
      fetchUsers(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      message.error('Lỗi khi xóa người dùng');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar, record) => (
        <Avatar
          src={avatar}
          icon={<UserOutlined />}
          size="large"
        >
          {!avatar && record.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      )
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => (
        <div>
          <div><strong>{record.name}</strong></div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.email}</div>
          {record.phone && (
            <div style={{ color: '#666', fontSize: '12px' }}>{record.phone}</div>
          )}
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 1 ? 'red' : 'blue'}>
          {role === 1 ? 'Admin' : 'User'}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 1 },
        { text: 'User', value: 0 }
      ],
      onFilter: (value, record) => record.role === value
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (address) => address || <span style={{ color: '#ccc' }}>Chưa cập nhật</span>
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120, // Giảm độ rộng cột hành động vì chỉ còn 1 nút
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa người dùng">
              <Button
                className={styles.deleteButton}
                danger
                icon={<DeleteOutlined />}
              > Xóa</Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.users}>
      <Card>
        <div className={styles.header}>
          <div>
            <h2>Quản lý Users</h2>
            <p>Quản lý tài khoản người dùng hệ thống</p>
          </div>
          {/* Nút thêm người dùng và các nút khác vẫn bị loại bỏ */}
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 6,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`
          }}
          className={styles.table}
        />

        {/* Modal chỉnh sửa người dùng đã bị loại bỏ hoàn toàn */}
      </Card>
    </div>
  );
};

export default Users;   