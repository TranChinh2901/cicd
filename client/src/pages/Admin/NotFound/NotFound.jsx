
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div>
<Result
            status="404"
            title="404"
            subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
            extra={
                <Button type="primary" onClick={() => navigate('/admin/dashboard')}>
                    Về trang chủ
                </Button>
            }
        />
          </div>
    );
};

export default NotFound;