import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/api/v1/auth/login', formData);
            
            if (response.data.success) {
                setAuth({
                    user: response.data.user_success,
                    token: response.data.token
                });
                
                // Chuyển hướng dựa trên role
                if (response.data.user_success.role === 1) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            alert(error.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
        </div>
    );
};

export default Login;