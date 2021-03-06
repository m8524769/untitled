import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  PageHeader,
  Skeleton,
  Table,
  Tag,
  Modal,
  Descriptions,
  Typography,
  Badge,
  message,
} from 'antd';
import { SyncOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';
import { CONTRACT_ACCOUNT } from 'constants/eos';

const PAGE_SIZE = 4;

const columns = [
  {
    dataIndex: ['block_time'],
    render: (text) => text.replace('T', ' '),
  },
  {
    dataIndex: ['action_trace', 'act'],
    render: (text) => (
      <Tag color={text.account === CONTRACT_ACCOUNT ? 'geekblue' : 'purple'}>
        {text.account}::{text.name}
      </Tag>
    ),
  },
  {
    dataIndex: ['action_trace', 'act', 'data'],
    render: (text) => JSON.stringify(text),
  },
];

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [lastIrreversibleBlock, setLastIrreversibleBlock] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const { rpc, account } = useContext(AuthContext);

  useEffect(() => {
    if (account.name) {
      getTransactions(account.name);
    } else {
      setLoading(true);
      setTransactions([]);
    }
  }, [account]);

  const getTransactions = async (account: string) => {
    setLoading(true);
    try {
      const result = await rpc.history_get_actions(account);
      console.log('Recent Transactions:', result);
      setLastIrreversibleBlock(result.last_irreversible_block);
      setTransactions(
        result.actions
          .filter(
            (action) =>
              action.action_trace.act.name !== 'transfer' ||
              action.action_trace.receiver === account,
          )
          .reverse(),
      );
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      }
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <PageHeader
      title="Recent Transactions"
      extra={[
        <Button
          type="link"
          icon={<LeftOutlined />}
          key="prev-page"
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
        />,
        <Button
          type="link"
          icon={<RightOutlined />}
          key="next-page"
          onClick={() => {
            if (currentPage < transactions.length / PAGE_SIZE) {
              setCurrentPage(currentPage + 1);
            }
          }}
        />,
        <Button
          shape="round"
          icon={<SyncOutlined />}
          loading={loading}
          key="refresh"
          onClick={() => getTransactions(account.name)}
        />,
      ]}
    >
      <Skeleton
        active
        loading={loading}
        title={false}
        paragraph={{ rows: 6, width: 450 }}
      >
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey={(record) => record.action_trace.trx_id}
          showHeader={false}
          size="small"
          scroll={{
            x: 'max-content',
          }}
          pagination={{
            simple: true,
            pageSize: PAGE_SIZE,
            current: currentPage,
            style: {
              display: 'none',
            },
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
                  okText: 'Got it',
                  content: (
                    <Descriptions column={1} style={{ marginTop: '16px' }}>
                      <Descriptions.Item label="Transaction ID">
                        <Typography.Text code copyable>
                          {record.action_trace.trx_id}
                        </Typography.Text>
                      </Descriptions.Item>

                      <Descriptions.Item label="Status">
                        {record.block_num <= lastIrreversibleBlock ? (
                          <Badge status="success" text="Irreversible" />
                        ) : (
                          <Badge status="processing" text="Confirming" />
                        )}
                      </Descriptions.Item>

                      <Descriptions.Item label="Block Number">
                        {record.block_num}
                      </Descriptions.Item>

                      <Descriptions.Item label="Block Time">
                        {record.block_time.replace('T', ' ')}
                      </Descriptions.Item>

                      <Descriptions.Item label="Action">
                        <Tag
                          color={
                            record.action_trace.act.account === CONTRACT_ACCOUNT
                              ? 'geekblue'
                              : 'purple'
                          }
                        >
                          {record.action_trace.act.account}::
                          {record.action_trace.act.name}
                        </Tag>
                      </Descriptions.Item>

                      <Descriptions.Item label="Authorization">
                        {record.action_trace.act.authorization.map(
                          (authorization) => (
                            <Tag color="green" key={authorization.actor}>
                              {`${authorization.actor}@${authorization.permission}`}
                            </Tag>
                          ),
                        )}
                      </Descriptions.Item>

                      <Descriptions.Item label="Data">
                        <Typography.Text code copyable>
                          {JSON.stringify(record.action_trace.act.data)}
                        </Typography.Text>
                      </Descriptions.Item>
                    </Descriptions>
                  ),
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
