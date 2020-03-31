import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('authStore')
@observer
class Home extends React.Component<any, any> {
  state = {};

  componentDidMount() {}

  render() {
    // const { status } = this.props.homeStore;

    return (
      <Fragment>
        <h1>Home Page</h1>
      </Fragment>
    );
  }
}

export default withRouter(Home);
