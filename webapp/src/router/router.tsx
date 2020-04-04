import React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import Home from './Home/Home';
import Dashboard from './Dashboard/Dashboard';

const router = (
  <Switch>
    {/* 首页 */}
    <Route exact path="/" component={Home} />

    {/* 仪表盘 */}
    <Route exact path="/dashboard" component={Dashboard} />

    {/* 匹配失败 */}
    <Route component={NoMatch} />
  </Switch>
);

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
