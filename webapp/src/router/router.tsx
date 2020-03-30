import React from 'react';
import { Route, Switch, Redirect, RouteProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import Admin from './App/Admin/Admin';
import Developer from './App/Developer/Developer';
import authStore from './Auth/AuthStore';
import UserManagement from './User/UserManagement/UserManagement';

const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => (
  <Route
    {...rest}
    render={(props) =>
      sessionStorage.getItem('isLoggedIn') === 'true' ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const router = (
  <Switch>
    {/* 首页 */}
    <Route exact path="/">
      <Redirect to="/app/developer" />
    </Route>

    <Route path="/app">
      <PrivateRoute exact path="/app/developer" component={Developer} />
      <PrivateRoute exact path="/app/admin" component={Admin} />
      <PrivateRoute exact path="/app/user" component={UserManagement} />
      <Route exact path="/app">
        <Redirect to="/app/developer" />
      </Route>
    </Route>

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
