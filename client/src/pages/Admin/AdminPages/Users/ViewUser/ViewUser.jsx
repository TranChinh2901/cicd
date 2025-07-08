import { Breadcrumb, Button } from "antd"
import { FaThList } from "react-icons/fa";
import styles from "./ViewUser.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { ExportOutlined } from '@ant-design/icons';
const API_URL = import.meta.env.VITE_API;


const ViewUser = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const getAllUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/auth/users`)
                console.log(response.data);
                setUsers(response.data.users)
            } catch (error) {
                console.log('Lỗi không thể lấy dữ liệu', error);

            }
        };
        getAllUser();
    }, [])

    const exportToExcel = () => {
        // Format dữ liệu cho Excel
        const excelData = users.map((item, index) => ({
            'STT': index + 1,
            'Họ và tên': item.name,
            'Email': item.email,
            'Giới tính': item.gender,
            'Số điện thoại': item.phone,
            'Địa chỉ': `${item.address}`,
        }));


        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);


        XLSX.utils.book_append_sheet(wb, ws, "Danh sách người dùng");


        XLSX.writeFile(wb, "danh-sach-nguoi-dung.xlsx");
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Breadcrumb
                    items={[
                        {
                            title: 'Trang chủ',
                        },
                        {
                            title: 'QL người dùng',
                        },
                        {
                            title: 'Xem thông tin'
                        }

                    ]}
                    style={{
                        margin: '16px 0',
                    }}
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

            <div className={styles.danhSachQL}>
                <div className={styles.danhSachNGuoiDung}>
                    <div className={styles.danhSachNGuoiDungIn}>
                        <FaThList /> Danh sách người dùng hệ thống
                    </div>
                </div>
                <div className={styles.bangDanhSach}>
                    <table className={styles.table} style={{ zIndex: '100', marginTop: '15px' }}>
                        <thead>


                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Họ và tên</th>
                                <th scope="col">Email</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Số DT</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Link github</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.gender}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.address}</td>
                                        <td>{user.github}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ViewUser