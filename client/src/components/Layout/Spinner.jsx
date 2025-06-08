import React from 'react';
import { Spin } from 'antd';
import Layout from './Layout';

const Spinner = () => {
  return (
   <Layout>
     <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
    </div>
   </Layout>
  );
};

export default Spinner;