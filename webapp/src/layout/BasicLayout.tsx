import React, { useContext } from 'react';
import { Layout, Menu, Dropdown, Row, Col, Button } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import { AuthContext } from 'context/AuthContext';
import { ExportOutlined } from '@ant-design/icons';

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
  const { account, login, signout } = useContext(AuthContext);

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
              <Button type="primary" onClick={login}>
                Login with Scatter
              </Button>
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
