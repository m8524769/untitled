import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message, PageHeader, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { CONTRACT_ACCOUNT, TOKEN_SYMBOL } from 'constants/eos';
import Api from 'api';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';
import IPFS from 'ipfs';

interface NewFileInfo {
  cid: string;
  description: string;
  price: string;
}

const PublishFile: React.FC = () => {
  const [ipfs, setIpfs] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [publishLoading, setPublishLoading] = useState(false);

  const [form] = Form.useForm();

  const { account } = useContext(AuthContext);

  useEffect(() => {
    initIpfsNode();
  }, []);

  const initIpfsNode = async () => {
    const node = await IPFS.create();
    setIpfs(node);
  };

  const cidValidator = async (rule, value) => {
    try {
      for await (const file of ipfs.files.ls(`/ipfs/${value}`)) {
        console.log(file);
        setFileSize(file.size);
      }
    } catch (e) {
      setFileSize(0);
      throw new Error('File does not exist on IPFS');
    }
  };

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
                size: fileSize,
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
        <Form.Item
          label="CID"
          name="cid"
          hasFeedback={true}
          rules={[
            {
              required: true,
              validator: cidValidator,
            },
          ]}
        >
          <Input.Password
            placeholder="Content identifier on IPFS"
            disabled={!ipfs}
          />
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
