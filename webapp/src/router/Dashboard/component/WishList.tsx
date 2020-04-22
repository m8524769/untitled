import React, { useState, useEffect, useContext } from 'react';
import { Skeleton, List, message, Button, Modal } from 'antd';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import { SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const WishList: React.FC = () => {
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { rpc, account, transact } = useContext(AuthContext);

  useEffect(() => {
    if (account.name) {
      getWishList(account.name);
    } else {
      setLoading(true);
      setWishList([]);
    }
  }, [account]);

  const getWishList = async (account: string) => {
    setLoading(true);
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: CONTRACT_ACCOUNT,
        scope: account,
        table: 'wishlist',
        reverse: true,
      });
      console.log('Wish List:', result.rows);
      setWishList(result.rows);
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      } else {
        message.error(e);
      }
    }
    setLoading(false);
  };

  const removeWish = async (fileId: number) => {
    try {
      await transact({
        account: CONTRACT_ACCOUNT,
        name: 'removewish',
        authorization: [
          {
            actor: account.name,
            permission: account.authority,
          },
        ],
        data: {
          account: account.name,
          file_id: fileId,
        },
      });
      message.success('Wish Removed');
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      }
      console.error(e);
    }
  };

  return (
    <Skeleton active loading={loading} title={false} paragraph={{ rows: 10 }}>
      <List
        itemLayout="horizontal"
        dataSource={wishList}
        renderItem={(wish) => (
          <List.Item
            actions={[
              <a
                key="remove-wish"
                onClick={() => {
                  Modal.confirm({
                    title: 'Are you sure to remove it?',
                    icon: <ExclamationCircleOutlined />,
                    cancelText: 'Not sure',
                    okText: 'Confirm',
                    onOk() {
                      removeWish(wish.file_id);
                    },
                  });
                }}
              >
                Remove
              </a>,
            ]}
          >
            <List.Item.Meta title={wish.description} />
          </List.Item>
        )}
        footer={
          <Button
            icon={<SyncOutlined />}
            loading={loading}
            key="refresh"
            onClick={() => getWishList(account.name)}
          >
            Refresh
          </Button>
        }
      />
    </Skeleton>
  );
};

export default WishList;
