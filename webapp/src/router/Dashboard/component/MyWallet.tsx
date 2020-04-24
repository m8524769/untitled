import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  PageHeader,
  Space,
  message,
  Statistic,
  Popover,
  Typography,
  Modal,
  Divider,
} from 'antd';
import {
  SyncOutlined,
  MoneyCollectOutlined,
  SendOutlined,
} from '@ant-design/icons';
import useInterval from '@use-it/interval';
import { TOKEN_SYMBOL, CONTRACT_ACCOUNT } from 'constants/eos';
import TokenTransfer, { TransferInfo } from './TokenTransfer';
import { RpcError } from 'eosjs';
import QRCode from 'qrcode.react';
import { AuthContext } from 'context/AuthContext';
import EosLogo from 'assets/eos-logo.svg';

const { Title, Paragraph, Text } = Typography;

const help = [
  {
    question: 'What should I do before buying files?',
    answer: `Please make sure you have successfully set the RSA keypair and hold the private key. You can reset it if you lose your key.`,
  },
  {
    question: 'How to buy files from others?',
    answer: `After placing orders, you need to transfer tokens to "${CONTRACT_ACCOUNT}" manually with a correct file ID in memo. (You should complete the payment within 15 minutes, otherwise the order may be replaced by others at any time)`,
  },
  {
    question: 'How to exchange tokens?',
    answer: `Just click "Transfer" and send tokens to "${CONTRACT_ACCOUNT}", then you will receive the equivalent tokens in a while. (Do NOT fill in anything in memo, otherwise the exchange will fail)`,
  },
  {
    question: 'Which tokens can be exchanged?',
    answer: `Only EOS and ${TOKEN_SYMBOL}.`,
  },
  {
    question: 'Will I get a token refund if I overpaid?',
    answer: `Sorry but no.`,
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
          if (balance[0]) {
            setBalance(balance[0]);
          } else {
            setBalance(`0.0000 ${symbol}`);
          }
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
            <div key={each.question} style={{ maxWidth: '292px' }}>
              <Text strong>{each.question}</Text>
              <Paragraph>{each.answer}</Paragraph>
            </div>
          ))}
        >
          <Button>Need Help?</Button>
        </Popover>

        <Button
          icon={<MoneyCollectOutlined />}
          onClick={() => {
            Modal.confirm({
              title: 'Scan to Pay me',
              content: (
                <div>
                  <QRCode
                    value={account.name}
                    size={200}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: EosLogo,
                      height: 68,
                      width: 68,
                    }}
                  />
                  <Divider>{account.name}</Divider>
                </div>
              ),
              maskClosable: true,
              okButtonProps: { style: { display: 'none' } },
              cancelButtonProps: { style: { display: 'none' } },
              style: { textAlign: 'center' },
            });
          }}
          disabled={loading}
        >
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
