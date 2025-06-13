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
  Avatar,
  Upload // Import Upload component
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  UploadOutlined // For the Ant Design Upload component
} from '@ant-design/icons';
import axios from 'axios';
import styles from './BrandLanguages.module.css'; // Make sure this path is correct

const API_URL = import.meta.env.VITE_API;

// --- Constants for messages ---
const MSG_FETCH_ERROR = 'Lỗi khi tải danh sách thương hiệu';
const MSG_CREATE_SUCCESS = 'Tạo thương hiệu thành công';
const MSG_UPDATE_SUCCESS = 'Cập nhật thương hiệu thành công';
const MSG_DELETE_SUCCESS = 'Xóa thương hiệu thành công';
const MSG_FORM_ERROR = 'Có lỗi xảy ra khi gửi form';
const MSG_DELETE_ERROR = 'Lỗi khi xóa thương hiệu';

const BrandLanguages = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form] = Form.useForm();
  // We'll use this to hold the *new* file's Base64 or the *existing* URL for preview
  const [currentLogoPreview, setCurrentLogoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission loading
  const [uploadedFile, setUploadedFile] = useState(null); // To store the actual file object for Base64 conversion

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/brand/brandLanguages`);
      if (response.data.success) {
        setBrands(response.data.data || []);
      } else {
        message.error(MSG_FETCH_ERROR);
      }
    } catch (error) {
      message.error(MSG_FETCH_ERROR);
      console.error('Fetch brands error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to convert file to Base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle file change from Ant Design Upload component
  const handleUploadChange = async ({ file, fileList }) => {
    if (file.status === 'removed') {
      setUploadedFile(null);
      setCurrentLogoPreview('');
      form.setFieldsValue({ logoBrand: '' }); // Clear URL input if file removed
      return;
    }

    // Only process if a new file is added (not an existing file from edit mode)
    if (file.originFileObj) {
      setUploadedFile(file.originFileObj); // Store the raw file object
      const base64 = await getBase64(file.originFileObj);
      setCurrentLogoPreview(base64); // Set for preview
      form.setFieldsValue({ logoBrand: base64 }); // Set Base64 in form field
    }
    // Return false to prevent Ant Design Upload from managing fileList state internally
    return false;
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE;
    }
    return true; // Allow the file to be added to fileList, but not auto-upload
  };


  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      let finalLogoData = values.logoBrand; // This will hold either the new Base64 or the existing URL

      // If a new file was selected (uploadedFile exists)
      if (uploadedFile) {
        finalLogoData = await getBase64(uploadedFile);
      }
      // If no new file was selected AND we are editing AND there was an existing logo, keep it
      else if (editingBrand && editingBrand.logoBrand && !values.logoBrand) {
        finalLogoData = editingBrand.logoBrand;
      }
      // If input URL is provided, use it (overrides file if both were entered)
      if (values.logoUrlInput) {
        finalLogoData = values.logoUrlInput;
      }

      const dataToSend = {
        nameBrand: values.nameBrand,
        logoBrand: finalLogoData
      };

      if (editingBrand) {
        await axios.put(`${API_URL}/api/v1/brand/brandLanguages/${editingBrand.slug}`, dataToSend);
        message.success(MSG_UPDATE_SUCCESS);
      } else {
        await axios.post(`${API_URL}/api/v1/brand/brandLanguage`, dataToSend);
        message.success(MSG_CREATE_SUCCESS);
      }

      setModalVisible(false);
      setEditingBrand(null);
      form.resetFields();
      setUploadedFile(null); // Reset uploaded file state
      setCurrentLogoPreview(''); // Reset preview state after submission
      fetchBrands();
    } catch (error) {
      console.error('Form submission error:', error);
      message.error(error.response?.data?.message || MSG_FORM_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    form.setFieldsValue({
      nameBrand: brand.nameBrand,
      logoBrand: brand.logoBrand, // Set existing URL/Base64 in main form field for validation
      logoUrlInput: brand.logoBrand?.startsWith('http') ? brand.logoBrand : '' // Set only if it's a URL
    });
    setCurrentLogoPreview(brand.logoBrand || ''); // Show existing logo for preview
    setUploadedFile(null); // Clear uploaded file state when editing
    setModalVisible(true);
  };

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`${API_URL}/api/v1/brand/brandLanguages/${slug}`);
      message.success(MSG_DELETE_SUCCESS);
      fetchBrands();
    } catch (error) {
      message.error(MSG_DELETE_ERROR);
      console.error('Delete brand error:', error);
    }
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logoBrand',
      key: 'logoBrand',
      width: 80,
      render: (logo) => (
        <Avatar
          src={logo}
          icon={<AppstoreOutlined />}
          size="large"
          shape="square"
          onError={(e) => {
            e.target.src = '/placeholder-image.png'; // Fallback image for broken links
            return true;
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
              setUploadedFile(null); 
              setCurrentLogoPreview(''); 
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
            pageSize: 7,
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
            setUploadedFile(null); // Reset uploaded file state
            setCurrentLogoPreview(''); // Reset preview state when closing modal
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
              label="Logo"
              required 
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Upload
                  name="logoFile"
                  listType="picture"
                  maxCount={1}
                  showUploadList={{ showRemoveIcon: true }}
                  beforeUpload={beforeUpload}
                  onChange={handleUploadChange}
                  // Hide the Upload button if a file is already selected or if there's an existing preview
                  fileList={uploadedFile ? [{ uid: '-1', name: uploadedFile.name, status: 'done', url: currentLogoPreview }] : []}
                >
                  {!uploadedFile && ( // Only show upload button if no file selected
                    <Button icon={<UploadOutlined />}>Tải ảnh lên (Max 2MB, JPG/PNG)</Button>
                  )}
                </Upload>

                {currentLogoPreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={currentLogoPreview}
                      alt="Logo Preview"
                      style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', border: '1px solid #eee' }}
                      onError={(e) => { e.target.src = '/placeholder-image.png'; }} // Fallback for broken preview
                    />
                  </div>
                )}

                <Form.Item
                  name="logoUrlInput" // Separate field for URL input
                  noStyle
                >
                  <Input
                    placeholder="Hoặc dán URL logo vào đây"
                    onChange={(e) => {
                      const url = e.target.value;
                      // When URL is typed, clear file upload state and update preview
                      setUploadedFile(null);
                      setCurrentLogoPreview(url);
                      form.setFieldsValue({ logoBrand: url }); // Update the main form field for submission
                    }}
                  />
                </Form.Item>
                {/* Custom validation for logo, checks if either a file is uploaded or a URL is provided */}
                <Form.Item
                  name="logoBrand" // This field is "hidden" but used for validation
                  hidden // This field is for internal form management/validation
                  rules={[
                    {
                      validator: async (_, value) => {
                        // Validate if a new file is uploaded OR an old logo exists OR a URL is provided
                        if (!uploadedFile && !editingBrand?.logoBrand && !form.getFieldValue('logoUrlInput')) {
                          return Promise.reject(new Error('Vui lòng tải lên ảnh hoặc cung cấp URL logo!'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input type="hidden" />
                </Form.Item>
              </div>
            </Form.Item>


            <Form.Item className={styles.formActions}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingBrand(null);
                    form.resetFields();
                    setUploadedFile(null); // Reset uploaded file state when canceling
                    setCurrentLogoPreview(''); // Reset preview state when canceling
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
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