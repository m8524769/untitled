import React, { useState, useEffect } from 'react';
import {
  Button,
  PageHeader,
  Skeleton,
  Table,
  Tag,
  Modal,
  Descriptions,
  Typography,
} from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Api from 'api';

const columns = [
  {
    dataIndex: ['action_trace', 'act'],
    render: (text) => (
      <Tag color="purple">{`${text.account}::${text.name}`}</Tag>
    ),
  },
  {
    dataIndex: ['action_trace', 'act', 'data'],
    render: (text) => JSON.stringify(text),
  },
];

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions('yk');
  }, []);

  const getTransactions = async (account: string) => {
    setLoading(true);
    const result = await Api.eos.rpc.history_get_actions(account);
    console.log(result);
    setTransactions(
      result.actions
        .filter((action) => action.action_trace.receiver === 'yk')
        .reverse(),
    );
    setLoading(false);
  };

  return (
    <PageHeader
      title="Recent Transactions"
      extra={
        <Button
          shape="round"
          icon={<SyncOutlined />}
          loading={loading}
          onClick={() => getTransactions('yk')}
        />
      }
    >
      <Skeleton active loading={loading}>
        <Table
          columns={columns}
          dataSource={transactions}
          showHeader={false}
          size="small"
          scroll={{
            x: 'max-content',
          }}
          pagination={{
            simple: true,
            pageSize: 4,
          }}
          style={{
            maxWidth: '450px',
            cursor: 'pointer',
          }}
          onRow={(record) => {
            return {
              onClick: (event) => {
                console.log(record);
                Modal.info({
                  title: 'Transaction Details',
                  width: 670,
                  content: (
                    <Descriptions column={1}>
                      <Descriptions.Item label="Transaction ID">
                        <Typography.Text code copyable>
                          {record.action_trace.trx_id}
                        </Typography.Text>
                      </Descriptions.Item>

                      <Descriptions.Item label="Block Number">
                        <Typography.Text>{record.block_num}</Typography.Text>
                      </Descriptions.Item>

                      <Descriptions.Item label="Block Time">
                        <Typography.Text>{record.block_time}</Typography.Text>
                      </Descriptions.Item>

                      <Descriptions.Item label="Action">
                        <Tag color="purple">
                          {`${record.action_trace.act.account}::${record.action_trace.act.name}`}
                        </Tag>
                      </Descriptions.Item>

                      <Descriptions.Item label="Data">
                        <Typography.Text code copyable>
                          {JSON.stringify(record.action_trace.act.data)}
                        </Typography.Text>
                      </Descriptions.Item>
                    </Descriptions>
                  ),
                  okText: 'Got it',
                });
              },
            };
          }}
        />
      </Skeleton>
    </PageHeader>
  );
};

export default RecentTransactions;
