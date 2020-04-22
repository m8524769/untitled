import React, { useState } from 'react';
import { Tabs } from 'antd';
import MyFiles from './MyFiles';
import WishList from './WishList';
import UnpaidOrders from './UnpaidOrders';

const Profile: React.FC = () => {
  const [unpaidOrdersTotal, setUnpaidOrdersTotal] = useState(0);

  return (
    <Tabs
      style={{
        padding: '16px 24px',
      }}
    >
      <Tabs.TabPane tab="My Files" key="my-files">
        <MyFiles></MyFiles>
      </Tabs.TabPane>

      <Tabs.TabPane tab="Wish List" key="wish-list">
        <WishList></WishList>
      </Tabs.TabPane>

      <Tabs.TabPane
        tab={`Unpaid Orders (${unpaidOrdersTotal})`}
        key="unpaid-orders"
      >
        <UnpaidOrders setTotal={setUnpaidOrdersTotal}></UnpaidOrders>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Profile;
