import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import { 
    Form, 
    Input, 
    Button, 
    Card, 
    Typography, 
    message,
    Select
} from 'antd';
import { 
    UserOutlined, 
    LockOutlined, 
    MailOutlined, 
    PhoneOutlined,
    GithubOutlined // Import icon GitHub
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API;
const { Title } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/v1/auth/register`, values);
            
            if (response.data.success) {
                toast.success('Đăng ký thành công!');
                navigate('/login');
            }
        } catch (error) {
            // Sử dụng message.error và toast.error để hiển thị thông báo lỗi
            const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
            message.error(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div style={{ 
                maxWidth: '550px', 
                margin: ' auto', 
                padding: '10px' 
            }}>
                <Card>
                    <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
                        Đăng Ký Tài Khoản
                    </Title>
                    
                    <Form
                        form={form}
                        name="register"
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            name="name"
                            label="Họ và tên" // Đã đổi sang tiếng Việt cho nhất quán
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ và tên!' },
                                { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nhập họ và tên"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Nhập email"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Nhập mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Nhập số điện thoại"
                            />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Giới tính"
                            rules={[
                                { required: true, message: 'Vui lòng chọn giới tính!' }
                            ]}
                        >
                            <Select placeholder="Chọn giới tính">
                                <Select.Option value="Nam">Nam</Select.Option>
                                <Select.Option value="Nữ">Nữ</Select.Option>
                                <Select.Option value="Khác">Khác</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ!' }
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Nhập địa chỉ"
                                rows={3}
                            />
                        </Form.Item>

                        <Form.Item
                            name="github" 
                            label="Link GitHub (tùy chọn)"
                            rules={[
                                { 
                                    pattern: /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, 
                                    message: 'Link GitHub không hợp lệ!' 
                                }
                            ]}
                        >
                            <Input
                                prefix={<GithubOutlined />} 
                                placeholder="Nhập link GitHub của bạn (ví dụ: https://github.com/yourusername)"
                            />
                        </Form.Item>
                      
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                            >
                                {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: 'center' }}>
                        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Register;