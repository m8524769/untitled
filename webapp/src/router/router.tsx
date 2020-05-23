import React from 'react';
import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router-dom';
import Home from './Home/Home';
import Dashboard from './Dashboard/Dashboard';

const router = (
  <Switch>
    {/* Home */}
    <Route exact path="/" component={Home} />

    {/* Dashboard */}
    <Route exact path="/dashboard" component={Dashboard} />

    {/* No Match */}
    <Redirect to="/" />
  </Switch>
);

export default router;
