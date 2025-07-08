

import { Card, Typography, Descriptions } from 'antd';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

const Profile = () => {
    const [auth] = useAuth();
    const user = auth?.user;

    return (
        <Layout title="Stratos - User Profile" description="View and manage your user profile information.">
            <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
                <Card>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                        User Profile
                    </Title>

                    {user && (
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
                            <Descriptions.Item label="Address">{user.address}</Descriptions.Item>
                            <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>
                            <Descriptions.Item label="Role">{user.role === 1 ? 'Admin' : 'User'}</Descriptions.Item>
                        </Descriptions>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default Profile;