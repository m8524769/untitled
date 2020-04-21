import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message, PageHeader, Space } from 'antd';
import {
  ExclamationCircleOutlined,
  ReloadOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { CONTRACT_ACCOUNT, TOKEN_SYMBOL } from 'constants/eos';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';
import NodeRSA from 'node-rsa';
import Hashes from 'jshashes';
import { IpfsContext } from 'context/IpfsContext';

interface NewFileInfo {
  cid: string;
  description: string;
  price: string;
}

const PublishFile: React.FC = () => {
  const [contractRsaPublicKey, setContractRsaPublicKey] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [publishLoading, setPublishLoading] = useState(false);

  const [form] = Form.useForm();

  const { rpc, account, transact } = useContext(AuthContext);
  const { ipfs, isIpfsReady } = useContext(IpfsContext);

  useEffect(() => {
    getContractRsaPublicKey();
  }, []);

  const getContractRsaPublicKey = async () => {
    const result = await rpc.get_table_rows({
      json: true,
      code: CONTRACT_ACCOUNT,
      scope: CONTRACT_ACCOUNT,
      table: 'rsa.keys',
      limit: 1,
    });
    setContractRsaPublicKey(result.rows[0].public_key);
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

  const encrypt = (string: string, publicKey: string): string => {
    return new NodeRSA(publicKey).encrypt(string, 'base64');
  };

  const sha256 = (string: string): string => {
    return new Hashes.SHA256().hex(string);
  };

  const createFile = async (newFileInfo: NewFileInfo) => {
    setPublishLoading(true);
    try {
      await transact({
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
          cid_hash: sha256(newFileInfo.cid),
          encrypted_cid: encrypt(newFileInfo.cid, contractRsaPublicKey),
          description: newFileInfo.description,
          size: fileSize,
          price: newFileInfo.price,
        },
      });
      message.success('Publish Successfully!');
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      }
      console.error(e);
    }
    setPublishLoading(false);
  };

  const onFinish = (values) => {
    Modal.confirm({
      title: 'Are you sure to publish it?',
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
            disabled={!isIpfsReady}
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
              icon={<TagsOutlined />}
              htmlType="submit"
              loading={publishLoading}
              disabled={!account.name}
            >
              Publish & Sell
            </Button>

            <Button
              icon={<ReloadOutlined />}
              htmlType="button"
              onClick={onReset}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </PageHeader>
  );
};

export default PublishFile;
