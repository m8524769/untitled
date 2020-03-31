import React, { Fragment } from 'react';
import { APP_CATEGORIES } from 'constants/app';
import { SyncOutlined } from '@ant-design/icons';
import {
  Cascader,
  Table,
  message,
  Button,
  Input,
  PageHeader,
  Divider,
  Modal,
  Avatar,
  Form,
} from 'antd';
import Api from 'api';
import { inject, observer } from 'mobx-react';
import appStore from '../AppStore';
import authStore from 'router/Auth/AuthStore';
import registerPermission, {
  AdminPermission,
} from 'enhancer/registerPermission';
import { withRouter } from 'react-router-dom';
import { AppRequestParams } from 'api/app.api';

@inject('authStore')
@inject('appStore')
@registerPermission(AdminPermission)
@observer
class Admin extends React.Component<any, any> {
  state = {
    apps: [],
    total: 0,
  };

  componentDidMount() {
    this.getApps({ page: 1, pageSize: 7 });
  }

  getApps = (params: AppRequestParams) => {
    this.props.appStore.setStatus({ loading: true });
    Api.app
      .getUnreviewedApps(params)
      .then((response) => {
        console.log(response.data);
        this.setState({
          apps: response.data.content,
          total: response.data.totalElements,
        });
        this.props.appStore.setStatus({ loading: false });
      })
      .catch((error) => message.error(error));
  };

  render() {
    const { status } = this.props.appStore;

    const columns = [
      {
        dataIndex: 'icon',
        key: 'icon',
        render: (text, record) => (
          <Avatar
            shape="square"
            src={`http://localhost:3000/icons/${record.apkName}.png`}
            srcSet={`http://localhost:3000/icons/${record.apkName}.png`}
          />
        ),
      },
      {
        title: '应用名称',
        dataIndex: 'softwareName',
        key: 'softwareName',
        // fixed: 'left' as const,
      },
      {
        title: '类别',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: '界面语言',
        dataIndex: 'interfaceLanguage',
        key: 'interfaceLanguage',
      },
      {
        title: '支持 ROMs',
        dataIndex: 'supportRom',
        key: 'supportRom',
      },
      {
        title: 'APK 下载',
        dataIndex: 'apkName',
        key: 'apkName',
        render: (text) => (
          <a href={`http://localhost:3000/apks/${text}`}>{text}</a>
        ),
      },
      {
        title: '大小',
        dataIndex: 'softwareSize',
        key: 'softwareSize',
        render: (text) => `${text}MB`,
      },
      // {
      //   title: '平台',
      //   dataIndex: 'productType',
      //   key: 'productType',
      //   align: 'center' as const,
      //   sorter: (a, b) => a.productType.localeCompare(b.productType),
      //   onFilter: (value, record) => record.productType === value,
      // },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        align: 'center' as const,
        // fixed: 'right' as const,
        width: 120,
        render: (text, record) => {
          return (
            <Fragment>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  Modal.confirm({
                    title: `确认批准 ${record.softwareName}？`,
                    cancelText: '再想想',
                    centered: true,
                    onOk() {
                      Api.app
                        .acceptApp(record.id)
                        .then((response) => {
                          message.success(`您已批准 ${record.softwareName}`);
                        })
                        .catch((error) => {
                          message.error(`操作失败，原因：${error}`);
                        });
                    },
                  });
                }}
              >
                批准
              </Button>
              <Divider type="vertical" />
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  Modal.confirm({
                    title: `确认驳回 ${record.softwareName}？`,
                    cancelText: '再想想',
                    centered: true,
                    onOk() {
                      Api.app
                        .rejectApp(record.id)
                        .then((response) => {
                          message.success(`您已驳回 ${record.softwareName}`);
                        })
                        .catch((error) => {
                          message.error(`操作失败，原因：${error}`);
                        });
                    },
                  });
                }}
              >
                驳回
              </Button>
            </Fragment>
          );
        },
      },
    ];

    // const expandedRowRender = () => {
    // }

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
                icon={<SyncOutlined />}
                loading={status.loading}
                onClick={() => this.getApps({ page: 1, pageSize: 7 })}
              >
                刷新
              </Button>
            </Fragment>
          }
        />
        <Form
          layout="inline"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '8px',
            padding: '0 8px',
          }}
        >
          <Form.Item>
            <Cascader
              options={APP_CATEGORIES}
              placeholder="选择类别"
              changeOnSelect
              showSearch={{ filter }}
              onChange={(value: string[]) => {
                const categoryString = value.join(' / ');
                console.log(categoryString);
                appStore.setStatus({ category: categoryString });
                this.getApps({
                  keyword: status.softwareNameKeyword,
                  category: categoryString,
                  page: 1,
                });
              }}
            />
          </Form.Item>
          <Form.Item>
            <Input.Search
              placeholder="搜索"
              defaultValue={status.softwareNameKeyword}
              onSearch={(value: string) => {
                appStore.setStatus({ softwareNameKeyword: value });
                this.getApps({
                  keyword: value,
                  category: status.category,
                  page: 1,
                });
              }}
              enterButton
            />
          </Form.Item>
        </Form>

        <Table
          columns={columns}
          dataSource={this.state.apps}
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
              this.getApps({
                keyword: status.softwareNameKeyword,
                category: status.category,
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

function filter(inputValue, path) {
  return path.some(
    (option) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  );
}

export default withRouter(Admin);
