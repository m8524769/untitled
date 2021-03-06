import React, { useContext, useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Dropdown,
  Row,
  Col,
  Button,
  message,
  notification,
  Typography,
  Radio,
} from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import { AuthContext, WalletType } from 'context/AuthContext';
import {
  ExportOutlined,
  KeyOutlined,
  DashboardOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import { RpcError } from 'eosjs';
import NodeRSA from 'node-rsa';

const navLinks = [
  {
    path: '/',
    label: 'Home',
    icon: <HomeOutlined />,
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
  },
];

const supportedWallets = ['scatter', 'anchor'];
const walletLabel = {
  scatter: 'Scatter',
  anchor: 'Anchor',
};

const BasicLayout: React.FC = (props: any) => {
  const [defaultWallet, setDefaultWallet] = useState<WalletType>('scatter');

  const { account, login, signout, transact } = useContext(AuthContext);

  useEffect(() => {
    const wallet = localStorage.getItem('defaultWallet');
    if (wallet) {
      setDefaultWallet(wallet as WalletType);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('defaultWallet', defaultWallet);
  }, [defaultWallet]);

  const onSetKeyClick = () => {
    const key = new NodeRSA({ b: 512 });
    setKey(key.exportKey('public')).then(() => {
      notification.open({
        message: 'Please save your RSA private key',
        description: (
          <Typography.Text code copyable>
            {key.exportKey('private')}
          </Typography.Text>
        ),
        duration: null,
      });
    });
  };

  const setKey = async (rsaPublicKey: string) => {
    try {
      await transact({
        account: CONTRACT_ACCOUNT,
        name: 'setkey',
        authorization: [
          {
            actor: account.name,
            permission: account.authority,
          },
        ],
        data: {
          account: account.name,
          rsa_public_key: rsaPublicKey,
        },
      });
      message.success('Your RSA public key is setting successfully!');
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      }
      console.error(e);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header>
        <Row justify="space-between" align="middle">
          <Col span={18}>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[props.location.pathname]}
              style={{ lineHeight: '64px' }}
            >
              {navLinks.map((navLink) => (
                <Menu.Item key={navLink.path}>
                  <NavLink to={navLink.path}>
                    {navLink.icon}
                    {navLink.label}
                  </NavLink>
                </Menu.Item>
              ))}
            </Menu>
          </Col>

          <Col
            span={6}
            style={{
              textAlign: 'end',
            }}
          >
            {account.name ? (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={onSetKeyClick}>
                      <KeyOutlined />
                      Set RSA keypair
                    </Menu.Item>

                    <Menu.Item onClick={signout}>
                      <ExportOutlined />
                      Sign out
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button type="link">Current Account: {account.name}</Button>
              </Dropdown>
            ) : (
              <Dropdown
                overlay={
                  <Menu selectable={false}>
                    <Menu.ItemGroup title="Choose your wallet:">
                      <Menu.Item>
                        <Radio.Group
                          name="choose-wallet"
                          onChange={(e) => setDefaultWallet(e.target.value)}
                          value={defaultWallet}
                        >
                          {supportedWallets.map((wallet) => (
                            <Radio value={wallet} key={wallet}>
                              {walletLabel[wallet]}
                            </Radio>
                          ))}
                        </Radio.Group>
                      </Menu.Item>
                    </Menu.ItemGroup>
                  </Menu>
                }
              >
                <Button type="primary" onClick={() => login(defaultWallet)}>
                  Login with {walletLabel[defaultWallet]}
                </Button>
              </Dropdown>
            )}
          </Col>
        </Row>
      </Layout.Header>
      <Layout.Content style={{ padding: '0 50px' }}>
        <div
          style={{
            background: '#fff',
            padding: 24,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {props.children}
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default withRouter(BasicLayout);
