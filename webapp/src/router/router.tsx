import React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import Home from './Home/Home';
import Dashboard from './Dashboard/Dashboard';

const router = (
  <Switch>
    {/* Home */}
    <Route exact path="/" component={Home} />

    {/* Dashboard */}
    <Route exact path="/dashboard" component={Dashboard} />

    {/* No Match */}
    <Route component={NoMatch} />
  </Switch>
);

function NoMatch() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Not Found"
      extra={
        <Link to="/">
          <Button type="primary">Go back Home</Button>
        </Link>
      }
    />
  );
}

export default router;
