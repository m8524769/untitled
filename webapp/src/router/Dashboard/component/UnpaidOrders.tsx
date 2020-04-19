import React, { useState, useEffect, useContext } from 'react';
import { Skeleton, List, message, Button, Modal } from 'antd';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import { SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface UnpaidOrdersProps {
  setTotal: (total: number) => void;
}

const UnpaidOrders: React.FC<UnpaidOrdersProps> = (
  props: UnpaidOrdersProps,
) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { rpc, account, transact } = useContext(AuthContext);

  useEffect(() => {
    if (account.name) {
      getOrders(account.name);
    } else {
      setLoading(true);
      setOrders([]);
    }
  }, [account]);

  useEffect(() => {
    props.setTotal(orders.length);
  }, [orders]);

  const getOrders = async (account: string) => {
    setLoading(true);
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: CONTRACT_ACCOUNT,
        scope: CONTRACT_ACCOUNT,
        table: 'orders',
        index_position: 2,
        lower_bound: account,
        upper_bound: account,
        key_type: 'i64',
        reverse: true,
      });
      console.log('Unpaid Orders:', result.rows);
      setOrders(result.rows);
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      } else {
        message.error(e);
      }
    }
    setLoading(false);
  };

  const cancelOrder = async (fileId: number) => {
    try {
      await transact({
        account: CONTRACT_ACCOUNT,
        name: 'cancelorder',
        authorization: [
          {
            actor: account.name,
            permission: account.authority,
          },
        ],
        data: {
          file_id: fileId,
        },
      });
      message.success('Order Canceled');
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      } else {
        message.error(e);
      }
    }
  };

  return (
    <Skeleton active loading={loading} title={false} paragraph={{ rows: 10 }}>
      <List
        itemLayout="horizontal"
        dataSource={orders}
        renderItem={(order) => (
          <List.Item
            actions={[
              <a
                key="cancel-order"
                onClick={() => {
                  Modal.confirm({
                    title: 'Are you sure to cancel this order?',
                    icon: <ExclamationCircleOutlined />,
                    cancelText: 'Not sure',
                    okText: 'Confirm',
                    onOk() {
                      cancelOrder(order.file_id);
                    },
                  });
                }}
              >
                Cancel Order
              </a>,
            ]}
          >
            <List.Item.Meta
              title={`File ID: ${order.file_id}`}
              description={`Create Time: ${order.create_time}`}
            />
            <div>Price: {order.price}</div>
          </List.Item>
        )}
        footer={
          <Button
            icon={<SyncOutlined />}
            loading={loading}
            key="refresh"
            onClick={() => getOrders(account.name)}
          >
            Refresh
          </Button>
        }
      />
    </Skeleton>
  );
};

export default UnpaidOrders;
