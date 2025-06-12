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
  Image,
  Upload // Import Upload component
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  UploadOutlined // Import UploadOutlined icon
} from '@ant-design/icons';
import axios from 'axios';
import styles from './CategoryLanguages.module.css';

const API_URL = import.meta.env.VITE_API;

const CategoryLanguagesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // State để quản lý file đã chọn bởi Ant Design Upload

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/category/categoryLanguages`);
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách danh mục');
      console.error(error);
    } finally {
      setLoading(false);
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

  // Hàm chuyển đổi file thành Base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (values) => {
    try {
      let imageCBase64 = null;
      if (fileList.length > 0) {
        // Lấy file đầu tiên từ fileList (người dùng chọn)
        imageCBase64 = await getBase64(fileList[0].originFileObj);
      } else if (editingCategory && editingCategory.imageC) {
        // Nếu không có file mới được chọn, giữ lại ảnh cũ (nếu có)
        imageCBase64 = editingCategory.imageC;
      }

      const payload = {
        ...values,
        brandLanguages: values.brandLanguages,
        imageC: imageCBase64 // Gửi chuỗi Base64
      };

      if (editingCategory) {
        // Update
        await axios.put(`${API_URL}/api/v1/category/categoryLanguages/${editingCategory.slug}`, payload);
        message.success('Cập nhật danh mục thành công');
      } else {
        // Create
        await axios.post(`${API_URL}/api/v1/category/categoryLanguages`, payload);
        message.success('Tạo danh mục thành công');
      }

      setModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
      setFileList([]); // Reset file list sau khi submit
      fetchCategories();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
      console.error('Lỗi khi submit:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      nameCategory: category.nameCategory,
      descriptionCategory: category.descriptionCategory,
      brandLanguages: category.brandLanguages?._id || category.brandLanguages,
      // Khi chỉnh sửa, nếu có ảnh, set nó vào fileList để hiển thị preview
      // (Không set vào trường form vì Upload không quản lý giá trị qua form.setFieldsValue trực tiếp)
    });
    // Set fileList cho Upload component để hiển thị ảnh hiện tại
    if (category.imageC) {
      setFileList([
        {
          uid: '-1', // Unique ID cho file, Ant Design cần
          name: 'current_image.png', // Tên hiển thị
          status: 'done', // Trạng thái của file
          url: category.imageC, // URL (hoặc Base64) để Ant Design hiển thị preview
        },
      ]);
    } else {
      setFileList([]); // Reset nếu không có ảnh cũ
    }
    setModalVisible(true);
  };

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`${API_URL}/api/v1/category/categoryLanguages/${slug}`);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error) {
      message.error('Lỗi khi xóa danh mục');
    }
  };

  // Props cho Upload component
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      form.setFieldsValue({ imageC: undefined }); // Xóa giá trị imageC trong form khi remove
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
        return Upload.LIST_IGNORE; // Ngăn không cho file được thêm vào danh sách
      }
      const isLt2M = file.size / 1024 / 1024 < 2; // Giới hạn 2MB
      if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]); // Chỉ cho phép 1 file
      return false; // Ngăn Ant Design Upload tự động upload
    },
    fileList,
    listType: "picture-card", // Hiển thị dưới dạng thẻ ảnh
    maxCount: 1, // Chỉ cho phép tải lên 1 ảnh
  };


  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageC',
      key: 'imageC',
      width: 120,
      render: (imageC) => (
        imageC ? ( // Kiểm tra xem imageC có tồn tại không
          <Image
            style={{ cursor: 'pointer', objectFit: 'cover', borderRadius: '4px' }}
            src={imageC}
            alt="Category Image"
            width={64}
            height={64}
            preview={true}
          />
        ) : (
          <div style={{ width: 64, height: 64, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfbfbf', fontSize: '12px' }}>
            Không ảnh
          </div>
        )
      )
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'nameC',
      key: 'nameC',
      sorter: (a, b) => a.nameC.localeCompare(b.nameC),
      render: (name) => <strong>{name}</strong>
    },
    {
      title: 'Mô tả',
      dataIndex: 'descriptionC',
      key: 'descriptionC',
      ellipsis: true,
      render: (desc) => desc || <span style={{ color: '#ccc' }}>Chưa có mô tả</span>
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
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
            title="Bạn có chắc muốn xóa danh mục này?"
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
    <div className={styles.categoryLanguages}>
      <Card>
        <div className={styles.header}>
          <div>
            <h2>Quản lý Category Languages</h2>
            <p>Quản lý các danh mục ngôn ngữ lập trình</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null);
              form.resetFields();
              setFileList([]); // Reset file list khi thêm mới
              setModalVisible(true);
            }}
          >
            Thêm danh mục
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 7,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} danh mục`
          }}
          className={styles.table}
        />

        <Modal
          title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingCategory(null);
            form.resetFields();
            setFileList([]); // Reset file list khi hủy
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
              name="nameC"
              label="Tên danh mục"
              rules={[
                { required: true, message: 'Vui lòng nhập tên danh mục' },
                { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự' }
              ]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>

            <Form.Item
              name="descriptionC"
              label="Mô tả danh mục"
              rules={[
                { max: 500, message: 'Mô tả không được vượt quá 500 ký tự' }
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả cho danh mục"
                showCount
                maxLength={500}
              />
            </Form.Item>

            {/* THAY THẾ TRƯỜNG IMAGEC BẰNG UPLOAD COMPONENT */}
            <Form.Item
              name="imageC" // Giữ name để Ant Design Form quản lý state
              label="Ảnh danh mục"
              rules={[
                {
                  validator: async (_, value) => {
                    // Kiểm tra xem có file nào được chọn không, hoặc đang ở chế độ chỉnh sửa và có ảnh cũ không
                    if (fileList.length === 0 && (!editingCategory || !editingCategory.imageC)) {
                      throw new Error('Vui lòng tải lên ảnh danh mục');
                    }
                  },
                },
              ]}
              valuePropName="fileList" // Prop này kết nối với fileList của Upload
              getValueFromEvent={(e) => { // Lấy giá trị từ event của Upload
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload {...uploadProps}>
                {fileList.length < 1 && ( // Chỉ hiển thị nút upload nếu chưa có ảnh
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                )}
              </Upload>
            </Form.Item>


            <Form.Item
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
            </Form.Item>

            <Form.Item className={styles.formActions}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingCategory(null);
                    form.resetFields();
                    setFileList([]); // Reset file list khi hủy
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default CategoryLanguagesAdmin;