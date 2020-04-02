import React, { useState, useEffect } from 'react';
import { Button, PageHeader, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import useInterval from '@use-it/interval';
import Api from 'api';
import { TOKEN_SYMBOL } from 'constants/eos';

const MyWallet: React.FC = () => {
  const [balance, setBalance] = useState('--');
  const [loading, setLoading] = useState(true);

  const [updateTime, setUpdateTime] = useState(0);
  const [updateTimeFormat, setUpdateTimeFormat] = useState('Updated just now');

  useEffect(() => {
    getBalance('yk', TOKEN_SYMBOL);
  }, []);

  useInterval(() => {
    setUpdateTime(updateTime + 1);

    const hours = Math.floor(updateTime / 3600);
    const minutes = Math.floor((updateTime % 3600) / 60);
    const seconds = updateTime % 60;

    if (hours !== 0) {
      if (minutes !== 0) {
        setUpdateTimeFormat(`Updated ${hours}h ${minutes}m ago`);
      } else {
        setUpdateTimeFormat(`Updated ${hours}h ago`);
      }
    } else if (minutes !== 0) {
      if (seconds !== 0) {
        setUpdateTimeFormat(`Updated ${minutes}m ${seconds}s ago`);
      } else {
        setUpdateTimeFormat(`Updated ${minutes}m ago`);
      }
    } else if (seconds >= 15) {
      setUpdateTimeFormat(`Updated ${seconds}s ago`);
    } else {
      setUpdateTimeFormat(`Updated just now`);
    }
  }, 1000);

  const getBalance = (account: string, symbol: string): void => {
    setLoading(true);
    setBalance('--');
    Api.eos.rpc
      .get_currency_balance('eosio.token', account, symbol)
      .then((balance) => {
        setBalance(balance[0]);
        setLoading(false);
        setUpdateTime(0);
      });
  };

  return (
    <PageHeader
      title="My Wallet"
      subTitle={updateTimeFormat}
      extra={
        <Button
          shape="round"
          icon={<SyncOutlined />}
          loading={loading}
          onClick={() => getBalance('yk', TOKEN_SYMBOL)}
        />
      }
      style={{
        textAlign: 'end',
      }}
    >
      <Title level={2}>{balance}</Title>
      <Paragraph>≈＄8,371,928.17</Paragraph>
      <Space>
        <Button>Withdraw</Button>
        <Button>Recharge</Button>
        <Button type="primary">Transfer</Button>
      </Space>
    </PageHeader>
  );
};

export default MyWallet;
