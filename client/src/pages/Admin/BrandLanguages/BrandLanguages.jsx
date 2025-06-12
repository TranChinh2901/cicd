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
  Avatar // Import Avatar component
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import axios from 'axios';
import styles from './BrandLanguages.module.css';

const API_URL = import.meta.env.VITE_API;

const BrandLanguages = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form] = Form.useForm();
  const [logoBrandBase64, setLogoBrandBase64] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/brand/brandLanguages`);
      if (response.data.success) {
        setBrands(response.data.data || []);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách thương hiệu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBrandBase64(reader.result); // Lưu Base64 string vào state
        form.setFieldsValue({ logoBrand: reader.result }); // Cập nhật Form.Item
      };
      reader.readAsDataURL(file); // Đọc file thành Base64 Data URL
    } else {
      setLogoBrandBase64(''); // Xóa Base64 nếu không có file
      form.setFieldsValue({ logoBrand: '' }); // Xóa giá trị trong Form.Item
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Dữ liệu sẽ gửi đi bao gồm nameBrand và logoBrand (Base64 string)
      const dataToSend = {
        nameBrand: values.nameBrand,
        logoBrand: logoBrandBase64 || values.logoBrand // Ưu tiên Base64 mới nếu có, nếu không thì dùng giá trị từ form (URL cũ)
      };

      if (editingBrand) {
        await axios.put(`${API_URL}/api/v1/brand/brandLanguages/${editingBrand.slug}`, dataToSend);
        message.success('Cập nhật thương hiệu thành công');
      } else {
        await axios.post(`${API_URL}/api/v1/brand/brandLanguage`, dataToSend);
        message.success('Tạo thương hiệu thành công');
      }

      setModalVisible(false);
      setEditingBrand(null);
      form.resetFields();
      setLogoBrandBase64(''); // Reset Base64 state sau khi gửi form
      fetchBrands();
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    form.setFieldsValue({
      nameBrand: brand.nameBrand,
      logoBrand: brand.logoBrand // Hiển thị URL cũ trong input
    });
    setLogoBrandBase64(brand.logoBrand || ''); // Đặt Base64 state bằng URL cũ để hiển thị preview
    setModalVisible(true);
  };

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`${API_URL}/api/v1/brand/brandLanguages/${slug}`);
      message.success('Xóa thương hiệu thành công');
      fetchBrands();
    } catch (error) {
      message.error('Lỗi khi xóa thương hiệu');
    }
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logoBrand',
      key: 'logoBrand',
      width: 80,
      render: (logo, record) => (
        <Avatar
          src={logo} // Ant Design Avatar có thể hiển thị cả URL và Base64
          icon={<AppstoreOutlined />}
          size="large"
          shape="square"
          onError={(e) => { // Xử lý lỗi khi ảnh không tải được
            // console.error(`Không tải được ảnh: ${logo}`, e);
            e.target.src = '/placeholder-image.png'; // Đặt ảnh mặc định
            return true; // Ngăn console error của trình duyệt
          }}
        />
      )
    },
    {
      title: 'Tên thương hiệu',
      dataIndex: 'nameBrand',
      key: 'nameBrand',
      sorter: (a, b) => a.nameBrand.localeCompare(b.nameBrand)
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => <code>{slug}</code>
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
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa thương hiệu này?"
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
    <div className={styles.brandLanguages}>
      <Card>
        <div className={styles.header}>
          <div>
            <h2>Quản lý Brand Languages</h2>
            <p>Quản lý các thương hiệu ngôn ngữ lập trình</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBrand(null);
              form.resetFields();
              setLogoBrandBase64(''); // Reset Base64 state khi thêm mới
              setModalVisible(true);
            }}
          >
            Thêm thương hiệu
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={brands}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} thương hiệu`
          }}
          className={styles.table}
        />

        <Modal
          title={editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingBrand(null);
            form.resetFields();
            setLogoBrandBase64(''); // Reset Base64 state khi đóng modal
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className={styles.form}
          >
            <Form.Item
              name="nameBrand"
              label="Tên thương hiệu"
              rules={[
                { required: true, message: 'Vui lòng nhập tên thương hiệu' },
                { min: 2, message: 'Tên thương hiệu phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input placeholder="Nhập tên thương hiệu" />
            </Form.Item>

            <Form.Item
              name="logoBrand"
              label="Logo (URL hoặc tải lên)"
              // Remove required rule here, handle validation in handleSubmit if needed
            >
              <div>
                <input
                  type="file"
                  accept="image/*" // Chỉ chấp nhận file ảnh
                  onChange={handleFileChange}
                  style={{
                    border: "1px solid #d9d9d9", // Ant Design default border
                    borderRadius: "6px",
                    padding: "8px",
                    width: "100%",
                    cursor: "pointer",
                    marginBottom: "10px"
                  }}
                />
                {logoBrandBase64 && ( // Hiển thị preview nếu có Base64 string
                  <div style={{ marginBottom: '10px' }}>
                    <img
                      src={logoBrandBase64}
                      alt="Logo Preview"
                      style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', border: '1px solid #eee' }}
                    />
                  </div>
                )}
                <Input
                  placeholder="Hoặc dán URL logo vào đây"
                  value={form.getFieldValue('logoBrand')} // Lấy giá trị từ form state
                  onChange={(e) => {
                    form.setFieldsValue({ logoBrand: e.target.value });
                    setLogoBrandBase64(e.target.value); // Cập nhật Base64 state cũng để preview (nếu là URL)
                  }}
                />
              </div>
            </Form.Item>


            <Form.Item className={styles.formActions}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingBrand(null);
                    form.resetFields();
                    setLogoBrandBase64(''); // Reset Base64 state khi hủy
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingBrand ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default BrandLanguages;