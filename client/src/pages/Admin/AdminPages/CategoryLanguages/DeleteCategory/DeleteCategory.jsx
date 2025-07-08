import { useEffect, useState } from 'react';
import { Table, Breadcrumb, Image, Button, Tag } from 'antd';
import axios from 'axios';
import { DeleteOutlined, ExportOutlined, TagOutlined } from '@ant-design/icons';
import styles from './DeleteCategory.module.css'
import toast from 'react-hot-toast';
const API_URL = import.meta.env.VITE_API;

const DeleteCategory = () => {
    const [category, setCategory] = useState([]);
    const [brands, setBrands] = useState([]);
    useEffect(() => {
        getAllBrands();
        fetchBrands();
    }, [])
    const getAllBrands = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/category/categoryLanguages`);
            setCategory(response.data.data)
        } catch (error) {
            console.log('Lỗi trong khi getAllBrands', error);
        }
    };
    const fetchBrands = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/brand/brandLanguages`);
            if (response.data.success) {
                setBrands(response.data.data);
                // console.log("Dữ liệu Category:", response.data.data);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const reponse = await axios.delete(`${API_URL}/api/v1/category/categoryLanguages/${id}`);
            console.log('reponse', reponse);
            setCategory(category.filter((item) => item._id !== id));
            toast.success('Xóa category thành công');
        } catch (error) {
            console.log(error);
            toast.error('Xóa category thất bại');
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: 'id',
            render: (anh, record, index) => index + 1,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'nameC',
            key: 'nameC',
            render: (name) => {
                const truncated = name.length > 5 ? name.slice(0, 25) + '...' : name;
                return <span>{truncated}</span>;
            }
        },
        {
            title: 'Ảnh danh mục',
            dataIndex: 'imageC',
            key: 'imageC',
            render: (anh) => <Image src={anh} alt="Product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
        },
        {
            title: 'Mô tả',
            dataIndex: 'descriptionC',
            key: 'descriptionC',
            render: (text) => {
                const truncated = text.length > 100 ? text.slice(0, 50) + '...' : text;
                return <span>{truncated}</span>;
            }
        },
        {
            title: 'Ngôn ngữ LT',
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
            render: (date) => new Date(date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Button
                    className={styles.dangerButton}
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record._id)}
                >
                    Xóa
                </Button>
            )
        }


    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <Breadcrumb
                    items={[
                        { title: 'Dashboard' },
                        { title: 'QL danh mục' },
                        { title: 'Xóa' },
                    ]}
                    style={{ margin: '16px 0' }}
                />


            </div>

            <Table
                dataSource={category}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 7 }}
            />
        </div >
    );
};

export default DeleteCategory;