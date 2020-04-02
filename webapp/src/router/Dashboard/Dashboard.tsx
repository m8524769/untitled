import React from 'react';
import { Tabs, Skeleton, Input } from 'antd';
import MyWallet from './component/MyWallet';
import RecentTransactions from './component/RecentTransactions';
import IpfsUpload from './component/IpfsUpload';
import PublishFile from './component/PublishFile';

const Dashboard: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: 'minmax(auto, 230px)',
      }}
    >
      <div
        style={{
          gridColumn: '1 / 2',
          gridRow: '1',
        }}
      >
        <MyWallet></MyWallet>
      </div>

      <div
        style={{
          gridColumn: '2 / 3',
          gridRow: '1',
        }}
      >
        <RecentTransactions></RecentTransactions>
      </div>

      <div
        style={{
          gridColumn: '3 / 4',
          gridRow: '1 / 5',
        }}
      >
        <IpfsUpload></IpfsUpload>
        <PublishFile></PublishFile>
      </div>

      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <Input.Search
            placeholder="Search files"
            onSearch={() => {}}
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
