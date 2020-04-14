import React from 'react';
import { Tabs, Badge } from 'antd';
import MyFiles from './MyFiles';

const Profile: React.FC = () => {
  return (
    <Tabs
      style={{
        padding: '16px 24px',
      }}
    >
      <Tabs.TabPane tab="My Files" key="my-files">
        <MyFiles></MyFiles>
      </Tabs.TabPane>

      <Tabs.TabPane tab="Wish List" key="wish-list"></Tabs.TabPane>

      <Tabs.TabPane
        tab={
          <Badge dot={true} offset={[3, 0]}>
            Unpaid Orders
          </Badge>
        }
        key="unpaid-orders"
      ></Tabs.TabPane>
    </Tabs>
  );
};

export default Profile;
