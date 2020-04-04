import React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import authStore from './Auth/AuthStore';
import Home from './Home/Home';
import Dashboard from './Dashboard/Dashboard';

const router = (
  <Switch>
    {/* 首页 */}
    <Route exact path="/" component={Home} />

    <Route exact path="/dashboard" component={Dashboard} />

    {/* 登录 */}
    <Route path="/login" component={Login} />

    {/* 匹配失败 */}
    <Route component={NoMatch} />
  </Switch>
);

function Login() {
  return (
    <Result
      title="抱歉，您尚未登录任何账户"
      extra={
        <Button
          type="primary"
          key="console"
          onClick={() => {
            authStore.showLoginModal();
          }}
        >
          登录
        </Button>
      }
    />
  );
}

function NoMatch() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="页面不存在"
      extra={
        <Link to="/">
          <Button type="primary">回到首页</Button>
        </Link>
      }
    />
  );
}

export default router;
