import React, { useContext, useState } from 'react';
import { Form, Input, Button, Modal, message, PageHeader, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { CONTRACT_ACCOUNT, TOKEN_SYMBOL } from 'constants/eos';
import Api from 'api';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';

interface NewFileInfo {
  cid: string;
  description: string;
  price: string;
}

const PublishFile: React.FC = () => {
  const [publishLoading, setPublishLoading] = useState(false);

  const [form] = Form.useForm();

  const { account } = useContext(AuthContext);

  const createFile = async (newFileInfo: NewFileInfo) => {
    console.log(newFileInfo);
    setPublishLoading(true);
    try {
      const result = await Api.eos.transact(
        {
          actions: [
            {
              account: CONTRACT_ACCOUNT,
              name: 'createfile',
              authorization: [
                {
                  actor: account.name,
                  permission: account.authority,
                },
              ],
              data: {
                owner: account.name,
                ...newFileInfo,
              },
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        },
      );
      message.success(`Transaction id: ${result.transaction_id}`, 4);
      message.success('Publish Successfully!');
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      }
    }
    setPublishLoading(false);
  };

  const onFinish = (values) => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      cancelText: 'Not now',
      okText: 'Confirm',
      onOk() {
        createFile(values).then(() => {
          onReset();
        });
      },
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <PageHeader title="Publish File">
      <Form
        layout="vertical"
        form={form}
        name="publish-file"
        onFinish={onFinish}
      >
        <Form.Item label="CID" name="cid" rules={[{ required: true }]}>
          <Input.Password placeholder="Content identifier on IPFS" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea placeholder="Should include the file name" />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <Input placeholder={`E.g. 1.0000 ${TOKEN_SYMBOL}`} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={publishLoading}
              disabled={!account.name}
            >
              Publish & Sell
            </Button>

            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </PageHeader>
  );
};

export default PublishFile;
