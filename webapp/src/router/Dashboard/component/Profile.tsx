import React from 'react';
import { Tabs, Badge, Button, Space } from 'antd';
import MyFiles from './MyFiles';
import { KeyOutlined } from '@ant-design/icons';

const Profile: React.FC = () => {
  return (
    <Tabs
      defaultActiveKey="my-files"
      tabBarExtraContent={
        <Space>
          <Button icon={<KeyOutlined />}>
            Import RSA Key
          </Button>
        </Space>
      }
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
