import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Layout, Menu } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';
import LoginModal from 'router/Auth/component/LoginModal';

class BasicLayout extends React.Component<any, any> {
  state = {
    navLinks: [
      {
        path: '/app/developer',
        label: '开发者平台',
        icon: 'android',
      },
      {
        path: '/app/admin',
        label: '后台管理',
        icon: 'tool',
      },
    ],
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[this.props.location.pathname]}
            style={{ lineHeight: '64px' }}
          >
            {this.state.navLinks.map((navLink) => (
              <Menu.Item key={navLink.path}>
                <NavLink to={navLink.path}>
                  <LegacyIcon type={navLink.icon} theme="filled" />
                  {navLink.label}
                </NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </Layout.Header>
        <Layout.Content style={{ padding: '0 50px' }}>
          <div
            style={{
              background: '#fff',
              padding: 24,
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            {this.props.children}
          </div>
        </Layout.Content>
        <LoginModal />
      </Layout>
    );
  }
}

export default withRouter(BasicLayout);
