import React from 'react';
import { Result, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';

// 权限说明
export type Permission = () => Promise<void>;

const reverse = (promise: Promise<any>): Promise<any> =>
  new Promise((resolve, reject) =>
    Promise.resolve(promise).then(reject, resolve),
  );

const promiseAny = (iterable: Promise<any>[]): Promise<any> =>
  reverse(Promise.all([...iterable].map(reverse)));

// 校验添加的权限，拥有任意一个权限即可
const validate = (permissions: Permission[]): Promise<any> =>
  promiseAny(permissions.map((permission) => permission()));

export const AdminPermission: Permission = () =>
  PermissionRequired.adminRequired();
export const DeveloperPermission: Permission = () =>
  PermissionRequired.developerRequired();

export const PermissionRequired = {
  passerRequired: () =>
    PermissionCheck.isDefault() ? Promise.resolve() : Promise.reject(),
  adminRequired: () =>
    PermissionCheck.isAdmin() ? Promise.resolve() : Promise.reject(),
  developerRequired: () =>
    PermissionCheck.isDevloper() ? Promise.resolve() : Promise.reject(),
};

export const PermissionCheck = {
  isDefault: () => true,
  isAdmin: () => {
    return sessionStorage.getItem('userType') === 'admin';
  },
  isDevloper: () => {
    return sessionStorage.getItem('userType') === 'developer';
  },
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
