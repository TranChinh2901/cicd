import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Avatar, // Giữ lại Avatar để hiển thị ảnh
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined, // Icon cho ảnh blog
  EyeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import styles from './BlogLanguages.module.css';

const API_URL = import.meta.env.VITE_API;

const BlogLanguagesAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/blog/blogLanguages`);
      if (response.data.success) {
        setBlogs(response.data.data || []);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách blog');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Payload chỉ chứa title, content, image như trong Postman
      const payload = {
        title: values.title, // Lấy từ form field 'title'
        content: values.content, // Lấy từ form field 'content'
        image: values.image,   // Lấy từ form field 'image'
      };

      if (editingBlog) {
        // Update
        await axios.put(`${API_URL}/api/v1/blog/blogLanguages/${editingBlog.slug}`, payload);
        message.success('Cập nhật blog thành công');
      } else {
        // Create
        await axios.post(`${API_URL}/api/v1/blog/blogLanguages`, payload);
        message.success('Tạo blog thành công');
      }

      setModalVisible(false);
      setEditingBlog(null);
      form.resetFields();
      fetchBlogs();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
      console.error('Lỗi khi submit:', error);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    // Điền giá trị vào form fields từ blog object, chỉ dùng title, content, image
    form.setFieldsValue({
      title: blog.title,
      content: blog.content,
      image: blog.image,
    });
    setModalVisible(true);
  };

  const handleView = (blog) => {
    setViewingBlog(blog);
    setViewModalVisible(true);
  };

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`${API_URL}/api/v1/blog/blogLanguages/${slug}`);
      message.success('Xóa blog thành công');
      fetchBlogs();
    } catch (error) {
      message.error('Lỗi khi xóa blog');
    }
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image', // dataIndex là 'image'
      key: 'image',
      width: 80,
      render: (image) => (
        <Avatar
          src={image}
          icon={<FileTextOutlined />}
          size="large"
          shape="square"
        />
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title', // dataIndex là 'title'
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => <strong>{text}</strong> // Chỉ hiển thị tiêu đề
    },
    {
      title: 'Nội dung (Preview)',
      dataIndex: 'content', // dataIndex là 'content'
      key: 'content',
      ellipsis: true, // Để nội dung dài tự động ẩn
      render: (content) => content || <span style={{ color: '#ccc' }}>Chưa có nội dung</span>
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
      width: 250,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa blog này?"
            onConfirm={() => handleDelete(record.slug)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.blogLanguages}>
      <Card>
        <div className={styles.header}>
          <div>
            <h2>Quản lý Blog Languages</h2>
            <p>Quản lý các bài viết blog</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBlog(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Thêm blog
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={blogs}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 7,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} blog`
          }}
          className={styles.table}
        />

        {/* Create/Edit Modal */}
        <Modal
          title={editingBlog ? 'Chỉnh sửa blog' : 'Thêm blog mới'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingBlog(null);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
          >
            <Form.Item
              name="title" // Tên field trong form là 'title'
              label="Tiêu đề blog"
              rules={[
                { required: true, message: 'Vui lòng nhập tiêu đề blog' },
                { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' }
              ]}
            >
              <Input placeholder="Nhập tiêu đề blog" />
            </Form.Item>

            <Form.Item
              name="content" // Tên field trong form là 'content'
              label="Nội dung blog"
              rules={[
                { required: true, message: 'Vui lòng nhập nội dung blog' }
              ]}
            >
              <Input.TextArea
                rows={10} // Tăng số hàng cho nội dung
                placeholder="Nhập nội dung chi tiết của blog"
                showCount
              />
            </Form.Item>

            <Form.Item
              name="image" // Tên field trong form là 'image'
              label="Ảnh đại diện URL"
              rules={[
                { type: 'url', message: 'URL không hợp lệ' },
                { required: true, message: 'Vui lòng nhập URL ảnh' }
              ]}
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            <Form.Item className={styles.formActions}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingBlog(null);
                    form.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingBlog ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Modal */}
        <Modal
          title="Chi tiết blog"
          open={viewModalVisible}
          onCancel={() => {
            setViewModalVisible(false);
            setViewingBlog(null);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setViewModalVisible(false);
              setViewingBlog(null);
            }}>
              Đóng
            </Button>
          ]}
          width={700}
        >
          {viewingBlog && (
            <div className={styles.viewContent}>
              <div className={styles.viewHeader}>
                <Avatar
                  src={viewingBlog.image}
                  icon={<FileTextOutlined />}
                  size={64}
                  shape="square"
                />
                <div className={styles.viewTitle}>
                  <h3>{viewingBlog.title}</h3>
                  <p>Slug: <code>{viewingBlog.slug}</code></p>
                </div>
              </div>

              <div className={styles.viewDetails}>
                <div className={styles.detailItem}>
                  <strong>Nội dung:</strong>
                  <div className={styles.contentPreview}>
                    {viewingBlog.content}
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <strong>Ngày tạo:</strong>
                  <span>{new Date(viewingBlog.createdAt).toLocaleString('vi-VN')}</span>
                </div>

                <div className={styles.detailItem}>
                  <strong>Cập nhật lần cuối:</strong>
                  <span>{new Date(viewingBlog.updatedAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default BlogLanguagesAdmin;