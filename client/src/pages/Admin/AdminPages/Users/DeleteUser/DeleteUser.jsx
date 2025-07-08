import { Breadcrumb } from "antd"
import axios from "axios";
import styles from '../ViewUser/ViewUser.module.css';
import { useEffect, useState } from "react"
import { FaThList } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API;


const DeleteUser = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/auth/users`);
                setUsers(response.data.users)
            } catch (error) {
                console.log('Loi khong lay duoc tat ca user', error);

            }
        };
        getAllProducts();
    }, [])

    const deleteUser = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/v1/auth/users/${id}`);
            console.log('Xóa người dùng thành công', response.data);
            setUsers(users.filter(user => user._id != id))
            toast.success('Xóa người dùng thành công')
        } catch (error) {
            console.log('Xóa người dùng thấtj bại', error);
            toast.error('Xóa ngươif dùng thất bại');
        }
    }
    return (
        <div>
            <div>
                <Breadcrumb
                    items={[
                        {
                            title: 'Trang chủ',
                        },
                        {
                            title: 'QL người dùng',
                        },
                        {
                            title: 'Xóa người dùng'
                        }

                    ]}
                    style={{
                        margin: '16px 0',
                    }}
                />
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
                                <th scope="col">Hành động</th>
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
                                        <td>
                                            <div className={styles.buttonXoaND}>
                                                <RiDeleteBin6Line style={{ fontSize: '18px', textAlign: 'center', color: '#FF0000' }}
                                                    onClick={() => deleteUser(user._id)}
                                                />
                                                {/* <p>Xóa</p> */}
                                            </div>
                                        </td>

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

export default DeleteUser