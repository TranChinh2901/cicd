import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Breadcrumb, Form, Input, Button, Upload, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import LoadingAdmin from "../../../LoadingAdmin";
const API_URL = import.meta.env.VITE_API;

const UpdateCategory = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [categoryId, setCategoryId] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            if (!slug) {
                toast.error("Không tìm thấy slug để tải dữ liệu category.");
                setLoading(false);
                return;
            }
            try {
                console.log('Fetching category by SLUG:', slug);
                console.log('API URL for GET by SLUG:', `${API_URL}/api/v1/category/categoryLanguages/${slug}`);

                const response = await axios.get(`${API_URL}/api/v1/category/categoryLanguages/${slug}`);
                const categoryData = response.data.data;


                form.setFieldsValue({
                    nameCategory: categoryData.nameCategory,
                    description: categoryData.description,
                });
                setImageUrl(categoryData.image);
                setCategoryId(categoryData._id);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu category:", error);
                toast.error("Không thể tải dữ liệu danh mục.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCategory();
        } else {
            setLoading(false);
        }
    }, [slug, form]);

    const onFinish = async (values) => {

        if (!categoryId) {
            toast.error("Không thể cập nhật: Không tìm thấy ID category.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nameCategory', values.nameCategory);
            formData.append('description', values.description);
            if (values.image && values.image.file) {
                formData.append('image', values.image.file.originFileObj);
            } else {

                if (imageUrl) {
                    formData.append('image', imageUrl);
                }
            }


            const response = await axios.put(`${API_URL}/api/v1/category/categoryLanguages/${categoryId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Cập nhật category thành công!");
            navigate('/admin/categories/view');
        } catch (error) {
            console.error("Lỗi khi cập nhật category:", error);
            toast.error(error.response?.data?.message || "Cập nhật category thất bại.");
        }
    };

    const handleUploadChange = ({ fileList }) => {
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(fileList[0].originFileObj);
        } else if (fileList.length === 0) {
            setImageUrl(null);
        }
        return fileList;
    };

    if (loading) {
        return <LoadingAdmin />;
    }

    return (
        <div>
            <Breadcrumb
                items={[
                    { title: 'Dashboard' },
                    { title: 'QL danh mục' },
                    { title: 'Chỉnh sửa ' },
                ]}
                style={{ margin: '16px 0' }}
            />
            <h2>Chỉnh sửa danh mục </h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{}}
            >
                <Form.Item
                    label="Tên danh mục "
                    name="nameCategory"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Ảnh danh mục">
                    {imageUrl && (
                        <div style={{ marginBottom: 16 }}>
                            <p>Ảnh hiện tại:</p>
                            <Image src={imageUrl} alt="Ảnh Category" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
                        </div>
                    )}
                    <Form.Item name="image" valuePropName="fileList" getValueFromEvent={handleUploadChange} noStyle>
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
                        </Upload>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateCategory;
