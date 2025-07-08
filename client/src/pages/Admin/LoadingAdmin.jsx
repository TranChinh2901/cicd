
import { Spin } from 'antd';

const LoadingAdmin = () => {
    return (
        <div>
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        </div>
    );
};

export default LoadingAdmin;