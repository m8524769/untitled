import React, { Fragment } from 'react';
import { APP_CATEGORIES, APP_STATUS } from 'constants/app';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Cascader,
  Table,
  message,
  Button,
  Input,
  PageHeader,
  Select,
  Divider,
  Modal,
  Tag,
  Avatar,
  Form,
} from 'antd';
import moment from 'moment';
import Api from 'api';
import { inject, observer } from 'mobx-react';
import appStore from '../AppStore';
import authStore from 'router/Auth/AuthStore';
import CreateAppModal from '../component/CreateAppModal';
import registerPermission, {
  DeveloperPermission,
} from 'enhancer/registerPermission';
import { AppRequestParams } from 'api/app.api';
import { withRouter } from 'react-router-dom';
import UpdateAppModal from '../component/UpdateAppModal';
import UpdateVersionModal from '../component/UpdateVersionModal';

@inject('authStore')
@inject('appStore')
@registerPermission(DeveloperPermission)
@observer
class Developer extends React.Component<any, any> {
  state = {
    apps: [],
    total: 0,
  };

  componentDidMount() {
    this.getApps({ page: 1, pageSize: 7 });
  }

  getApps = (params: AppRequestParams) => {
    this.props.appStore.setStatus({ loading: true });
    const devId = Number(sessionStorage.getItem('userId'));
    Api.app
      .getApps({ ...params, devId })
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
        title: '当前版本',
        dataIndex: 'appVersionByVersionId',
        key: 'appVersionByVersionId',
        render: (text) => text && text.versionNo,
      },
      {
        title: '类别',
        dataIndex: 'category',
        key: 'category',
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
        render: (text) => (text ? `${text}MB` : '未知'),
      },
      {
        title: '下载量',
        dataIndex: 'downloads',
        key: 'downloads',
        render: (text) => {
          if (text >= 100000) return `${(text / 1000000).toFixed(2)}M`;
          if (text >= 1000) return `${(text / 1000).toFixed(1)}K`;
          return text;
        },
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
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        filteredValue: status.appStatus ? [status.appStatus] : null,
        onFilter: (value, record) => APP_STATUS[record.status].label === value,
        render: (text) => {
          return (
            text !== null && (
              <Tag color={APP_STATUS[text].color}>{APP_STATUS[text].label}</Tag>
            )
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        align: 'center' as const,
        // fixed: 'right' as const,
        width: 156,
        render: (text, record) => {
          return (
            <Fragment>
              {[1, 2, 3].includes(record.status) && (
                <Fragment>
                  <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => {
                      appStore.setStatus({ record: record });
                      appStore.showUpdateAppModal();
                    }}
                  >
                    更新
                  </Button>
                  <Divider type="vertical" />
                </Fragment>
              )}
              {[1, 4].includes(record.status) && (
                <Fragment>
                  <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => {
                      Modal.confirm({
                        title: `确定上架 ${record.softwareName}？`,
                        cancelText: '再等等',
                        centered: true,
                        onOk() {
                          Api.app
                            .onSale(record.id)
                            .then((response) => {
                              message.success(
                                `您的 ${record.softwareName} 已成功上架`,
                              );
                            })
                            .catch((error) => {
                              message.error(`上架失败，原因：${error}`);
                            });
                        },
                      });
                    }}
                  >
                    上架
                  </Button>
                  <Divider type="vertical" />
                </Fragment>
              )}
              {record.status === 3 && (
                <Fragment>
                  <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => {
                      Modal.confirm({
                        title: `确定下架 ${record.softwareName}？`,
                        cancelText: '点错了',
                        centered: true,
                        onOk() {
                          Api.app
                            .offSale(record.id)
                            .then((response) => {
                              message.success(
                                `您的 ${record.softwareName} 已成功下架`,
                              );
                            })
                            .catch((error) => {
                              message.error(`下架失败，原因：${error}`);
                            });
                        },
                      });
                    }}
                  >
                    下架
                  </Button>
                  <Divider type="vertical" />
                </Fragment>
              )}
              {record.status !== 3 && (
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => {
                    Modal.confirm({
                      title: `确定删除 ${record.softwareName} 及其所有版本？`,
                      cancelText: '点错了',
                      centered: true,
                      onOk() {
                        Api.app
                          .deleteApp(record.id)
                          .then((response) => {
                            message.success(
                              `已成功摧毁 ${record.softwareName}`,
                            );
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
              )}
            </Fragment>
          );
        },
      },
    ];

    // 详细信息
    const expandedRowRender = (record) => {
      const columns = [
        {
          title: '历史版本',
          dataIndex: 'versionNo',
          key: 'versionNo',
        },
        {
          title: '版本说明',
          dataIndex: 'versionInfo',
          key: 'versionInfo',
          render: (text) => (text ? text : '无'),
        },
        {
          title: 'APK 下载',
          dataIndex: 'apkFileName',
          key: 'apkFileName',
          render: (text) => (
            <a href={`http://localhost:3000/apks/${text}`}>{text}</a>
          ),
        },
        {
          title: '大小',
          dataIndex: 'versionSize',
          key: 'versionSize',
          render: (text) => (text ? `${text}MB` : '未知'),
        },
        {
          title: '发布日期',
          dataIndex: 'creationDate',
          key: 'creationDate',
          render: (text) => (text ? moment(text).format('YYYY-MM-DD') : '未知'),
        },
        {
          title: '操作',
          dataIndex: 'actions',
          key: 'actions',
          align: 'center' as const,
          // fixed: 'right' as const,
          width: 156,
          render: (text, record) => {
            return (
              <Fragment>
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => {
                    appStore.setStatus({ versionRecord: record });
                    appStore.showUpdateVersionModal();
                  }}
                >
                  修改
                </Button>
              </Fragment>
            );
          },
        },
      ];
      return (
        <Table
          title={() => (
            <Fragment>
              <span style={{ marginRight: '16px' }}>{record.appInfo}</span>
              <span style={{ marginRight: '16px' }}>
                界面语言：{record.interfaceLanguage}
              </span>
              <span>支持 ROM：{record.supportRom}</span>
            </Fragment>
          )}
          columns={columns}
          dataSource={record.appVersionsById}
          rowKey="id"
          locale={{
            emptyText: status.loading ? '' : '暂无数据',
          }}
          pagination={false}
        />
      );
    };

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
              <Button
                type="primary"
                onClick={() => appStore.showCreateAppModal()}
              >
                <PlusOutlined />
                创建 / 发布新的 APP
              </Button>

              <CreateAppModal />
              <UpdateAppModal />
              <UpdateVersionModal />
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
            <Select
              placeholder="审核状态"
              style={{ width: 120 }}
              defaultValue={status.status}
              onChange={(value: string) =>
                appStore.setStatus({ appStatus: value })
              }
              allowClear
            >
              {Object.values(APP_STATUS).map((value) => {
                const label = value.label;
                return (
                  <Select.Option key={label} value={label}>
                    {label}
                  </Select.Option>
                );
              })}
            </Select>
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
          expandedRowRender={expandedRowRender}
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

export default withRouter(Developer);
