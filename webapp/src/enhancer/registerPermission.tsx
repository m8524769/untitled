import React from 'react';
import { Result, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';

export type Permission = () => Promise<void>;

const reverse = (promise: Promise<any>): Promise<any> =>
  new Promise((resolve, reject) =>
    Promise.resolve(promise).then(reject, resolve),
  );

const promiseAny = (iterable: Promise<any>[]): Promise<any> =>
  reverse(Promise.all([...iterable].map(reverse)));

const validate = (permissions: Permission[]): Promise<any> =>
  promiseAny(permissions.map((permission) => permission()));

export const PermissionRequired = {
  passerRequired: () =>
    PermissionCheck.isDefault() ? Promise.resolve() : Promise.reject(),
};

export const PermissionCheck = {
  isDefault: () => true,
};

const ComponentStatus = {
  PENDING: 'pending',
  FULL_FILLED: 'full_filled',
  REJECTED: 'rejected',
};

export default function registerPermission(
  ...permissions: Permission[]
): <T extends {}>(Component: React.ComponentType<T>) => void {
  return <T extends {}>(Component: React.ComponentType<T>) =>
    class PermissionWrapper extends React.Component<T> {
      state = {
        status: ComponentStatus.PENDING,
      };

      componentDidMount(): void {
        validate(permissions).then(
          (resolveRes) => {
            this.setState({ status: ComponentStatus.FULL_FILLED });
          },
          (rejectRes) => {
            this.setState({ status: ComponentStatus.REJECTED });
          },
        );
      }

      render() {
        const { status } = this.state;

        return (
          <React.Fragment>
            {status === ComponentStatus.PENDING && <Spin />}
            {status === ComponentStatus.FULL_FILLED && (
              <Component {...this.props} />
            )}
            {status === ComponentStatus.REJECTED && <NoPermission />}
          </React.Fragment>
        );
      }
    };
}

function NoPermission() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有此页面的访问权限。"
      extra={
        <Link to="/">
          <Button type="primary">回到首页</Button>
        </Link>
      }
    />
  );
}
