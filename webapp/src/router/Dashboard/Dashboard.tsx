import React from 'react';
import { Button, PageHeader, Space } from 'antd';
import IpfsUpload from './component/IpfsUpload';
import PublishFile from './component/PublishFile';
import Title from 'antd/lib/typography/Title';
import { SyncOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        // gridGap: '10px',
      }}
    >
      <PageHeader
        title="My Wallet"
        extra={<Button shape="circle" icon={<SyncOutlined />} />}
        style={{
          gridColumn: '1 / 2',
          gridRow: '1',
          textAlign: 'end',
        }}
      >
        <Title level={2}>45.2310 BTC</Title>
        <Space>
          <Button>Withdraw</Button>
          <Button>Recharge</Button>
          <Button type="primary">Transfer</Button>
        </Space>
      </PageHeader>

      <PageHeader
        title="Recent Transactions"
        extra={<Button shape="circle" icon={<SyncOutlined />} />}
        style={{
          gridColumn: '2 / 3',
          gridRow: '1',
        }}
      ></PageHeader>

      <PageHeader
        title="IPFS Upload"
        style={{
          gridColumn: '3 / 4',
          gridRow: '1',
        }}
      >
        <IpfsUpload></IpfsUpload>
      </PageHeader>

      <PageHeader
        title="Publish File"
        style={{
          gridColumn: '3 / 4',
          gridRow: '2 / 4',
        }}
      >
        <PublishFile></PublishFile>
      </PageHeader>
    </div>
  );
};

export default Dashboard;
