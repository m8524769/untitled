import React from 'react';
import { Tabs, Input, Skeleton } from 'antd';

const MyFiles: React.FC = () => {
  return (
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
  );
};

export default MyFiles;
