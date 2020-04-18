import React from 'react';
import { Row, Col } from 'antd';
import FileStore from './component/FileStore';

const Home: React.FC = () => {
  return (
    <Row justify="center" gutter={{ xs: 8, sm: 16, md: 24 }}>
      {/* <Col span={6}></Col> */}

      <Col span={14} style={{ minWidth: '700px' }}>
        <FileStore></FileStore>
      </Col>

      {/* <Col span={6}></Col> */}
    </Row>
  );
};

export default Home;
