import React, { Fragment } from 'react';
import { Table, message, Button, PageHeader, Icon, Modal, Divider } from 'antd';
import Api from 'api';
import { inject, observer } from 'mobx-react';
import authStore from 'router/Auth/AuthStore';
import registerPermission, {
  AdminPermission,
} from 'enhancer/registerPermission';
import { withRouter } from 'react-router-dom';
import { DeveloperRequestParams } from 'api/user.api';
import userStore from '../UserStore';
import CreateDeveloperModal from '../component/CreateDeveloperModal';
import UpdateDeveloperModal from '../component/UpdateDeveloperModal';

@inject('userStore')
@registerPermission(AdminPermission)
@observer
class UserManagement extends React.Component<any, any> {
  state = {
    developers: [],
    total: 0,
  };

  componentDidMount() {
    this.getDevelopers({ page: 1, pageSize: 7 });
  }

  getDevelopers = (params: DeveloperRequestParams) => {
    this.props.userStore.setStatus({ loading: true });
    Api.user
      .getDevelopers(params)
      .then((response) => {
        this.setState({
          developers: response.data.content,
          total: response.data.totalElements,
        });
        this.props.userStore.setStatus({ loading: false });
      })
      .catch((error) => message.error(error));
  };

  render() {
    const { status } = this.props.userStore;

    const columns = [
      {
        title: '用户 ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'devName',
        key: 'devName',
      },
      {
        title: '邮箱',
        dataIndex: 'devEmail',
        key: 'devEmail',
      },
      {
        title: '简介',
        dataIndex: 'devInfo',
        key: 'devInfo',
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        align: 'center' as const,
        width: 156,
        render: (text, record) => {
          return (
            <Fragment>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  userStore.setStatus({ record: record });
                  userStore.showUpdateDeveloperModal();
                }}
              >
                修改
              </Button>
              <Divider type="vertical" />
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  Modal.confirm({
                    title: `确定删除 ${record.devName}？`,
                    cancelText: '点错了',
                    centered: true,
                    onOk() {
                      Api.user
                        .deleteDeveloper(record.id)
                        .then(() => {
                          message.success(`已成功摧毁 ${record.devName}`);
                        })
                        .catch((error) => {
                          message.error(`删除失败，原因：${error}`);
                        });
                    },
                  });
                }}
              >
                删除
              </Button>
            </Fragment>
          );
        },
      },
    ];

    return (
      <Fragment>
        <PageHeader
          title="夜深了，王磊"
          subTitle={
            <Fragment>
              <Button
                type="link"
                style={{ paddingBottom: '8px' }}
                onClick={() => {
                  authStore.showLoginModal();
                }}
              >
                切换账户
              </Button>
              <Button
                type="link"
                style={{ padding: '0 0 8px 0' }}
                onClick={() => {
                  sessionStorage.setItem('isLoggedIn', 'false');
                  sessionStorage.removeItem('userId');
                  sessionStorage.removeItem('userType');
                  this.props.history.push(`/login`);
                }}
              >
                注销
              </Button>
            </Fragment>
          }
          extra={
            <Fragment>
              <Button
                icon="sync"
                loading={status.loading}
                onClick={() => this.getDevelopers({ page: 1, pageSize: 7 })}
              >
                刷新
              </Button>
              <Button
                type="primary"
                onClick={() => userStore.showCreateDeveloperModal()}
              >
                <Icon type="plus" />
                添加开发者
              </Button>

              <CreateDeveloperModal />
              <UpdateDeveloperModal />
            </Fragment>
          }
        />
        <Table
          columns={columns}
          dataSource={this.state.developers}
          loading={{
            spinning: status.loading,
            size: 'large',
            tip: '正在加载',
          }}
          style={{ margin: '0 24px' }}
          rowKey="id"
          locale={{
            emptyText: status.loading ? '' : '暂无数据',
          }}
          pagination={{
            total: this.state.total,
            showTotal: (total) => `共 ${total} 条数据`,
            showQuickJumper: true,
            defaultPageSize: 7,
            onChange: (page: number, pageSize: number) => {
              this.getDevelopers({
                page,
                pageSize,
              });
            },
          }}
        />
      </Fragment>
    );
  }
}

export default withRouter(UserManagement);
