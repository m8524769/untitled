import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  PageHeader,
  Space,
  message,
  Statistic,
  Popover,
  Typography,
} from 'antd';
import {
  SyncOutlined,
  QuestionCircleOutlined,
  MoneyCollectOutlined,
  SendOutlined,
} from '@ant-design/icons';
import useInterval from '@use-it/interval';
import { TOKEN_SYMBOL, CONTRACT_ACCOUNT } from 'constants/eos';
import TokenTransfer, { TransferInfo } from './TokenTransfer';
import { RpcError } from 'eosjs';
import { AuthContext } from 'context/AuthContext';

const { Title, Paragraph, Text } = Typography;

const help = [
  {
    question: 'How to buy files from others?',
    answer: `After placing an order, you need to transfer the tokens to ${CONTRACT_ACCOUNT} at the price in the order, and fill in the file ID correctly in memo, then you will see the file you purchased below. (It is best to complete the payment within 15 minutes, otherwise the order may be replaced by others in the future)`,
  },
  {
    question: 'How to exchange tokens?',
    answer: `Click "Transfer" and send tokens to ${CONTRACT_ACCOUNT} directly, then you will receive equivalent tokens in a while, remember not to fill in the memo, otherwise the exchange will fail.`,
  },
  {
    question: 'Which tokens can be exchanged?',
    answer: `Only EOS and ${TOKEN_SYMBOL}.`,
  },
];

const MyWallet: React.FC = () => {
  const [balance, setBalance] = useState('--');
  const [loading, setLoading] = useState(true);

  const [updateTime, setUpdateTime] = useState(0);
  const [updateTimeFormat, setUpdateTimeFormat] = useState('Updated just now');

  // Token Transfer Modal
  const [tonkenTransferVisible, setTokenTransferVisible] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);

  const { rpc, account, transact } = useContext(AuthContext);

  useEffect(() => {
    if (account.name) {
      getBalance(account.name, TOKEN_SYMBOL);
    } else {
      setLoading(true);
      setBalance('--');
    }
  }, [account]);

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
    try {
      await rpc
        .get_currency_balance('eosio.token', account, symbol)
        .then((balance) => {
          setBalance(balance[0]);
          setLoading(false);
          setUpdateTime(0);
          setUpdateTimeFormat('Updated just now');
        });
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      } else {
        message.error(e);
      }
    }
  };

  const transfer = async (transferInfo: TransferInfo) => {
    setTransferLoading(true);
    try {
      await transact({
        account: 'eosio.token',
        name: 'transfer',
        authorization: [
          {
            actor: account.name,
            permission: account.authority,
          },
        ],
        data: {
          from: account.name,
          ...transferInfo,
        },
      });
      setTokenTransferVisible(false);
      message.success('Transfer Successfully!');
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      }
      console.error(e);
    }
    setTransferLoading(false);
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
          onClick={() => getBalance(account.name, TOKEN_SYMBOL)}
        />
      }
      style={{
        textAlign: 'end',
      }}
    >
      <Title level={2}>{balance}</Title>

      <Statistic
        prefix="＄"
        value={parseFloat(balance.split(' ')[0]) * 416}
        precision={2}
      />

      <Space style={{ marginTop: '24px' }}>
        <Popover
          title="Q & A"
          placement="bottomLeft"
          trigger="click"
          content={help.map((each) => (
            <div key={each.question} style={{ maxWidth: '270px' }}>
              <Text strong>{each.question}</Text>
              <Paragraph>{each.answer}</Paragraph>
            </div>
          ))}
        >
          <Button icon={<QuestionCircleOutlined />}>Help</Button>
        </Popover>

        <Button icon={<MoneyCollectOutlined />} disabled={loading}>
          Receive
        </Button>

        <Button
          type="primary"
          icon={<SendOutlined />}
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
            getBalance(account.name, TOKEN_SYMBOL);
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
