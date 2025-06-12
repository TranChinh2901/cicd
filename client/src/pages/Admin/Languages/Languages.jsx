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
  Tag,
  Select,
  Avatar, // Import lại Avatar cho view modal
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  LinkOutlined,
  EyeOutlined,
  TagOutlined
} from '@ant-design/icons';
import axios from 'axios';
import styles from './Languages.module.css';

const API_URL = import.meta.env.VITE_API;

const LanguagesAdmin = () => {
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]); // THIẾU STATE BRANDS
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [viewingLanguage, setViewingLanguage] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLanguages();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/language/languages`);
      if (response.data.success) {
        setLanguages(response.data.data || []);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách ngôn ngữ');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/category/categoryLanguages`);
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/brand/brandLanguages`);
      if (response.data.success) {
        setBrands(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        answer: values.answer, 
        image: values.image, // SỬA: từ logoLanguage thành image
        categoryLanguages: values.categoryLanguages,
        brandLanguages: values.brandLanguages 
      };

      if (editingLanguage) {
        await axios.put(`${API_URL}/api/v1/language/languages/${editingLanguage.slug}`, payload);
        message.success('Cập nhật ngôn ngữ thành công');
      } else {
        await axios.post(`${API_URL}/api/v1/language/languages`, payload);
        message.success('Tạo ngôn ngữ thành công');
      }

      setModalVisible(false);
      setEditingLanguage(null);
      form.resetFields();
      fetchLanguages();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
      console.error('Lỗi khi submit:', error);
    }
  };

  const handleEdit = (language) => {
    setEditingLanguage(language);
    // SỬA: Set giá trị form fields đúng với tên field trong form
    form.setFieldsValue({
      name: language.name,
      description: language.description,
      answer: language.answer,
      image: language.image,
      categoryLanguages: language.categoryLanguages?._id || language.categoryLanguages,
      brandLanguages: language.brandLanguages?._id || language.brandLanguages
    });
    setModalVisible(true);
  };

  const handleView = (language) => {
    setViewingLanguage(language);
    setViewModalVisible(true);
  };

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`${API_URL}/api/v1/language/languages/${slug}`);
      message.success('Xóa ngôn ngữ thành công');
      fetchLanguages();
    } catch (error) {
      message.error('Lỗi khi xóa ngôn ngữ');
    }
  };

  const columns = [
    {
      title: 'Tên ngôn ngữ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <div>
          <strong>{name}</strong>
          <br />
          <span style={{ fontSize: '12px', color: '#666' }}>
            Slug: {record.slug}
          </span>
        </div>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc) => desc || <span style={{ color: '#ccc' }}>Chưa có mô tả</span>
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryLanguages',
      key: 'categoryLanguages',
      render: (category) => (
        category ? (
          <Tag color="green" icon={<TagOutlined />}>
            {category.nameC || category.nameCategory || 'Tên không xác định'}
          </Tag>
        ) : (
          <Tag color="default">Chưa gán</Tag>
        )
      )
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandLanguages',
      key: 'brandLanguages',
      render: (brand) => (
        brand ? (
          <Tag color="blue" icon={<TagOutlined />}>
            {brand.nameBrand || brand}
          </Tag>
        ) : (
          <Tag color="default">Chưa gán</Tag>
        )
      )
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
            title="Bạn có chắc muốn xóa ngôn ngữ này?"
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
    <div className={styles.languages}>
      <Card>
        <div className={styles.header}>
          <div>
            <h2>Quản lý Languages</h2>
            <p>Quản lý các ngôn ngữ lập trình</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingLanguage(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Thêm ngôn ngữ
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={languages}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} ngôn ngữ`
          }}
          className={styles.table}
        />

        {/* Create/Edit Modal */}
        <Modal
          title={editingLanguage ? 'Chỉnh sửa ngôn ngữ' : 'Thêm ngôn ngữ mới'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingLanguage(null);
            form.resetFields();
          }}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
          >
            <Form.Item
              name="name"
              label="Tên ngôn ngữ"
              rules={[
                { required: true, message: 'Vui lòng nhập tên ngôn ngữ' },
                { min: 2, message: 'Tên ngôn ngữ phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input placeholder="Nhập tên ngôn ngữ" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả ngôn ngữ"
              rules={[
                { max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự' }
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả cho ngôn ngữ"
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item
              name="answer"
              label="Câu trả lời/Giải thích"
              rules={[
                { max: 2000, message: 'Câu trả lời không được vượt quá 2000 ký tự' }
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Nhập câu trả lời hoặc giải thích chi tiết"
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <Form.Item
              name="image"
              label="URL ảnh ngôn ngữ"
              rules={[
                { required: true, message: 'Vui lòng nhập URL ảnh' },
                { type: 'url', message: 'URL không hợp lệ' }
              ]}
            >
              <Input placeholder="https://example.com/image.png" />
            </Form.Item>

            <Form.Item
              name="categoryLanguages"
              label="Danh mục"
              rules={[
                { required: true, message: 'Vui lòng chọn danh mục' }
              ]}
            >
              <Select
                placeholder="Chọn danh mục"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {categories.map(category => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.nameC || category.nameCategory}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* <Form.Item
              name="brandLanguages"
              label="Thương hiệu"
              rules={[
                { required: true, message: 'Vui lòng chọn thương hiệu' }
              ]}
            >
              <Select
                placeholder="Chọn thương hiệu"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {brands.map(brand => (
                  <Select.Option key={brand._id} value={brand._id}>
                    {brand.nameBrand}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}

            <Form.Item className={styles.formActions}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingLanguage(null);
                    form.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingLanguage ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* View Modal */}
        <Modal
          title="Chi tiết ngôn ngữ"
          open={viewModalVisible}
          onCancel={() => {
            setViewModalVisible(false);
            setViewingLanguage(null);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setViewModalVisible(false);
              setViewingLanguage(null);
            }}>
              Đóng
            </Button>
          ]}
          width={600}
        >
          {viewingLanguage && (
            <div className={styles.viewContent}>
              <div className={styles.viewHeader}>
                <Avatar
                  src={viewingLanguage.image}
                  icon={<BookOutlined />}
                  size={64}
                  shape="square"
                />
                <div className={styles.viewTitle}>
                  <h3>{viewingLanguage.name}</h3>
                  <p>Slug: <code>{viewingLanguage.slug}</code></p>
                </div>
              </div>

              <div className={styles.viewDetails}>
                <div className={styles.detailItem}>
                  <strong>Danh mục:</strong>
                  <Tag color="green">
                    {viewingLanguage.categoryLanguages?.nameC || viewingLanguage.categoryLanguages?.nameCategory || 'Chưa gán'}
                  </Tag>
                </div>

                <div className={styles.detailItem}>
                  <strong>Thương hiệu:</strong>
                  <Tag color="blue">
                    {viewingLanguage.brandLanguages?.nameBrand || 'Chưa gán'}
                  </Tag>
                </div>

                <div className={styles.detailItem}>
                  <strong>Mô tả:</strong>
                  <p>{viewingLanguage.description || 'Chưa có mô tả'}</p>
                </div>

                <div className={styles.detailItem}>
                  <strong>Câu trả lời:</strong>
                  <p>{viewingLanguage.answer || 'Chưa có câu trả lời'}</p>
                </div>

                <div className={styles.detailItem}>
                  <strong>Ngày tạo:</strong>
                  <span>{new Date(viewingLanguage.createdAt).toLocaleString('vi-VN')}</span>
                </div>

                <div className={styles.detailItem}>
                  <strong>Cập nhật lần cuối:</strong>
                  <span>{new Date(viewingLanguage.updatedAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default LanguagesAdmin;