import { useEffect, useState } from 'react';
import { Table, Breadcrumb, Image, Button } from 'antd';
import axios from 'axios';
import { FiEdit3 } from "react-icons/fi";
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { ExportOutlined } from '@ant-design/icons';
import styles from './BrandLanguages.module.css'
const API_URL = import.meta.env.VITE_API;

const ViewBrands = () => {
    const [brands, setBrands] = useState([]);
    useEffect(() => {
        const getAllBrands = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/brand/brandLanguages`);
                setBrands(response.data.data)
            } catch (error) {
                console.log('Lỗi trong khi getAllBrands', error);

            }
        };
        getAllBrands();
    }, [])



    const exportToExcel = () => {
        const excelData = brands.map((item, index) => ({
            'STT': index + 1,
            'Tên brands': item.nameBrand,
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
            title: 'Tên ngôn ngữ LT',
            dataIndex: 'nameBrand',
            key: 'nameBrand',
        },
        {
            title: 'Logo ngôn ngữ LT',
            dataIndex: 'logoBrand',
            key: 'logoBrand',
            render: (anh) => <Image src={anh} alt="Product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
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
                <Link className={styles.iconView} to={`/admin/brands/edit/${record.slug}`}>
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
                        { title: 'QL ngôn ngữ LT' },
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
                dataSource={brands} // Cấp dưu liêuj cho bangr
                columns={columns} // cấu hình cột 
                rowKey="id"
                pagination={{ pageSize: 7 }} // Cấu hình phân trang 
            />
        </div >
    );
};

export default ViewBrands;