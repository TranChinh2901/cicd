import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Layout title="Stratos - Page Not Found" description="The page you are looking for does not exist.">
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        Về trang chủ
                    </Button>
                }
            />
        </Layout>
    );
};

export default NotFoundPage;