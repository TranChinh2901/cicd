import React from 'react';
import { Spin } from 'antd';
// import Layout from './Layout';

const Spinner = () => {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    </div>
  );
};

export default Spinner;