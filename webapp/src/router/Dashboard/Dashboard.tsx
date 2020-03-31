import React from 'react';
import { Button, PageHeader, Space, Tabs, Skeleton, Input } from 'antd';
import IpfsUpload from './component/IpfsUpload';
import PublishFile from './component/PublishFile';
import Title from 'antd/lib/typography/Title';
import { SyncOutlined } from '@ant-design/icons';
import Paragraph from 'antd/lib/typography/Paragraph';

const Dashboard: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(auto, 230px)',
      }}
    >
      <PageHeader
        title="My Wallet"
        subTitle="Update 3m 45s ago"
        extra={<Button shape="round" icon={<SyncOutlined />} />}
        style={{
          gridColumn: '1 / 2',
          gridRow: '1',
          textAlign: 'end',
        }}
      >
        <Title level={2}>45.2310 BTC</Title>
        <Paragraph>≈＄8371928.17</Paragraph>
        <Space>
          <Button>Withdraw</Button>
          <Button>Recharge</Button>
          <Button type="primary">Transfer</Button>
        </Space>
      </PageHeader>

      <PageHeader
        title="Recent Transactions"
        extra={<Button shape="round" icon={<SyncOutlined />} />}
        style={{
          gridColumn: '2 / 3',
          gridRow: '1',
        }}
      >
        <Skeleton active />
      </PageHeader>

      <div
        style={{
          gridColumn: '3 / 4',
          gridRow: '1 / 5',
        }}
      >
        <PageHeader title="IPFS Upload">
          <IpfsUpload></IpfsUpload>
        </PageHeader>

        <PageHeader title="Publish File">
          <PublishFile></PublishFile>
        </PageHeader>
      </div>

      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <Input.Search
            placeholder="Search files"
            onSearch={(value: string) => {}}
            enterButton
          />
        }
        style={{
          gridColumn: '1 / 3',
          gridRow: '2 / 5',
          padding: '16px 24px',
        }}
      >
        <Tabs.TabPane tab="Bought Files" key="1">
          <Skeleton active />
          <Skeleton active />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Published Files" key="2">
          <Skeleton active />
          <Skeleton active />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard;
