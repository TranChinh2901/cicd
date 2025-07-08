import { useEffect, useState } from 'react';
import { Table, Breadcrumb, Image, Button, Tag } from 'antd';
import axios from 'axios';
import { FiEdit3 } from "react-icons/fi";
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { ExportOutlined, TagOutlined } from '@ant-design/icons';
import styles from './ViewLanguages.module.css'
const API_URL = import.meta.env.VITE_API;
import DOMPurify from 'dompurify';

const ViewLanguages = () => {
    const [languages, setLanguages] = useState([]);
    const [setBrands] = useState([]);

    useEffect(() => {
        getAllLanguages();
        fetchBrands();
    }, [])
    const getAllLanguages = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/language/languages`);
            setLanguages(response.data.data)
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
    const exportToExcel = () => {
        const excelData = languages.map((item, index) => ({
            'STT': index + 1,
            'Tên category': item.nameC,
            'Ngày tạo': item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }) : 'Chưa có dữ liệu'
        }));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, "Danh sách sản phẩm");
        XLSX.writeFile(wb, "danh-sach-san-pham.xlsx");
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: 'id',
            render: (anh, record, index) => index + 1,
        },
        {
            title: 'Tên bài học',
            dataIndex: 'name',
            key: 'name',
            render: (name) => {
                const truncated = name.length > 5 ? name.slice(0, 25) + '...' : name;
                return <span>{truncated}</span>;
            }
        },
        {
            title: 'Ảnh bài học',
            dataIndex: 'image',
            key: 'image',
            render: (anh) => <Image src={anh} alt="Product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
        },

        {
            title: 'title phụ',
            dataIndex: 'answer',
            key: 'answer',
            render: (text) => {
                const truncated = text.length > 100 ? text.slice(0, 50) + '...' : text;
                return <span>{truncated}</span>;
            }
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <div
                    dangerouslySetInnerHTML={{
                        __html: text
                            ? DOMPurify.sanitize(text).substring(0, 60) + '...'
                            : ''
                    }}
                />
            )
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
            title: 'Hành động',
            render: (_, record) => (
                <Link className={styles.iconView} to={`/admin/languages/edit/${record.slug}`}>
                    <FiEdit3 /> Chỉnh sửa
                </Link>
            )
        }


    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <Breadcrumb
                    items={[
                        { title: 'Dashboard' },
                        { title: 'QL bài học' },
                        { title: 'Xem ' },
                    ]}
                    style={{ margin: '16px 0' }}
                />

                <div style={{}}>
                    <Button
                        type="primary"
                        icon={<ExportOutlined />}
                        onClick={exportToExcel}
                        style={{
                            backgroundColor: ' #fafafa',
                            borderColor: ' #d7d4d4',
                            color: 'black'
                        }}
                    >
                        Xuất Excel
                    </Button>
                </div>
            </div>

            <Table
                dataSource={languages}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 7 }}
            />
        </div >
    );
};

export default ViewLanguages;