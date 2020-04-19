import React, { useContext } from 'react';
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
} from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import { AuthContext } from 'context/AuthContext';
import { ExportOutlined, KeyOutlined } from '@ant-design/icons';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import { RpcError } from 'eosjs';
import NodeRSA from 'node-rsa';

const navLinks = [
  {
    path: '/',
    label: 'Home',
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
  },
];

const BasicLayout: React.FC = (props: any) => {
  const { account, login, signout, transact } = useContext(AuthContext);

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
      } else {
        message.error(e);
      }
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
                  <NavLink to={navLink.path}>{navLink.label}</NavLink>
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
              <Dropdown.Button
                type="primary"
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => login('scatter')}>
                      Scatter
                    </Menu.Item>
                    <Menu.Item onClick={() => login('anchor')}>
                      Anchor
                    </Menu.Item>
                  </Menu>
                }
                onClick={() => login('scatter')}
              >
                Login with
              </Dropdown.Button>
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
