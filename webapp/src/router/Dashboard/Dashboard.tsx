import React from 'react';
import MyWallet from './component/MyWallet';
import RecentTransactions from './component/RecentTransactions';
import IpfsUpload from './component/IpfsUpload';
import PublishFile from './component/PublishFile';
import MyFiles from './component/MyFiles';

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

      <div
        style={{
          gridColumn: '1 / 3',
          gridRow: '2 / 5',
        }}
      >
        <MyFiles></MyFiles>
      </div>
    </div>
  );
};

export default Dashboard;
