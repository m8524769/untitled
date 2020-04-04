import React, { useState, useEffect } from 'react';
import { Button, PageHeader, Space, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import useInterval from '@use-it/interval';
import Api from 'api';
import { TOKEN_SYMBOL } from 'constants/eos';
import TokenTransfer, { TransferInfo } from './TokenTransfer';
import { RpcError } from 'eosjs';

const MyWallet: React.FC = () => {
  const [balance, setBalance] = useState('--');
  const [loading, setLoading] = useState(true);

  const [updateTime, setUpdateTime] = useState(0);
  const [updateTimeFormat, setUpdateTimeFormat] = useState('Updated just now');

  // Token Transfer Modal
  const [tonkenTransferVisible, setTokenTransferVisible] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);

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

  const getBalance = async (account: string, symbol: string) => {
    setLoading(true);
    setBalance('--');
    await Api.eos.rpc
      .get_currency_balance('eosio.token', account, symbol)
      .then((balance) => {
        setBalance(balance[0]);
        setLoading(false);
        setUpdateTime(0);
        setUpdateTimeFormat('Updated just now');
      });
  };

  const transfer = async (transferInfo: TransferInfo) => {
    console.log(transferInfo);
    setTransferLoading(true);
    try {
      const result = await Api.eos.transact(
        {
          actions: [
            {
              account: 'eosio.token',
              name: 'transfer',
              authorization: [
                {
                  actor: 'yk',
                  permission: 'active',
                },
              ],
              data: {
                from: 'yk',
                ...transferInfo,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      );
      setTokenTransferVisible(false);
      setTransferLoading(false);
      message.success(`Transaction id: ${result.transaction_id}`, 4);
      message.success('Transfer Successfully!');
    } catch (e) {
      setTransferLoading(false);
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      }
    }
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
        <Button disabled={loading}>Withdraw</Button>
        <Button disabled={loading}>Recharge</Button>
        <Button
          type="primary"
          onClick={() => setTokenTransferVisible(true)}
          disabled={loading}
        >
          Transfer
        </Button>
      </Space>

      <TokenTransfer
        visible={tonkenTransferVisible}
        balance={balance}
        transferLoading={transferLoading}
        onConfirm={(transferInfo) => {
          transfer(transferInfo).then(() => {
            getBalance('yk', TOKEN_SYMBOL);
          });
        }}
        onCancel={() => {
          setTokenTransferVisible(false);
        }}
      />
    </PageHeader>
  );
};

export default MyWallet;
