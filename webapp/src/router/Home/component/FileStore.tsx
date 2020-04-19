import React, { useContext, useState, useEffect } from 'react';
import {
  Skeleton,
  message,
  Select,
  PageHeader,
  Descriptions,
  Space,
  Button,
  Tag,
  Modal,
} from 'antd';
import { AuthContext } from 'context/AuthContext';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import { RpcError } from 'eosjs';
import Search from 'antd/lib/input/Search';
import Title from 'antd/lib/typography/Title';
import {
  ShoppingCartOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const FileStore: React.FC = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);

  const { rpc, account, transact } = useContext(AuthContext);

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    setLoading(true);
    try {
      const result = await rpc.get_table_rows({
        json: true,
        code: CONTRACT_ACCOUNT,
        scope: CONTRACT_ACCOUNT,
        table: 'files',
        reverse: true,
      });
      console.log('Files:', result.rows);
      setFiles(result.rows);
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      } else {
        message.error(e);
      }
    }
    setLoading(false);
  };

  const placeOrder = async (fileId: number) => {
    setPlaceOrderLoading(true);
    try {
      await transact({
        account: CONTRACT_ACCOUNT,
        name: 'placeorder',
        authorization: [
          {
            actor: account.name,
            permission: account.authority,
          },
        ],
        data: {
          buyer: account.name,
          file_id: fileId,
        },
      });
      message.success('Successfully Ordered!');
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      } else {
        message.error(e);
      }
    }
    setPlaceOrderLoading(false);
  };

  return (
    <Skeleton active loading={loading}>
      <Search
        addonBefore={
          <Select defaultValue="all" style={{ width: '90px' }}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="ebook">eBook</Select.Option>
            <Select.Option value="video">Video</Select.Option>
            <Select.Option value="music">Music</Select.Option>
            <Select.Option value="text">Text</Select.Option>
            <Select.Option value="others">Others</Select.Option>
          </Select>
        }
        enterButton
        size="large"
      />

      {files.map((file) => (
        <PageHeader
          title={file.description}
          tags={
            file.for_sale === 1 ? (
              <Tag color="green">For Sale</Tag>
            ) : (
              <Tag>Owner: {file.owner}</Tag>
            )
          }
          extra={<Title level={4}>{file.price}</Title>}
          key={file.cid_hash}
          style={{
            marginTop: '16px',
            border: '1px solid rgb(235, 237, 240)',
          }}
        >
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="CID Hash">
              {file.cid_hash}
            </Descriptions.Item>
          </Descriptions>

          <Space style={{ marginTop: '16px' }}>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              loading={placeOrderLoading}
              onClick={() => {
                Modal.confirm({
                  title: `Are you sure to place the order for ${file.description}?`,
                  icon: <ExclamationCircleOutlined />,
                  content: `You should transfer ${file.price} to ${CONTRACT_ACCOUNT} in 15 minutes with memo: ${file.id}`,
                  cancelText: 'Not now',
                  okText: 'Confirm',
                  onOk() {
                    placeOrder(file.id);
                  },
                });
              }}
              disabled={file.for_sale === 0 || account.name === file.owner}
            >
              Place Order
            </Button>

            <Button type="link" icon={<PlusOutlined />}>
              Add to Wish List
            </Button>
            <Button type="link" icon={<EllipsisOutlined />} />
          </Space>
        </PageHeader>
      ))}
    </Skeleton>
  );
};

export default FileStore;
