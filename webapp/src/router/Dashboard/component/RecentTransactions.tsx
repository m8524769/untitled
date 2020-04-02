import React from 'react';
import { Button, PageHeader, Skeleton } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const RecentTransactions: React.FC = () => {
  return (
    <PageHeader
      title="Recent Transactions"
      extra={<Button shape="round" icon={<SyncOutlined />} />}
    >
      <Skeleton active />
    </PageHeader>
  );
};

export default RecentTransactions;
