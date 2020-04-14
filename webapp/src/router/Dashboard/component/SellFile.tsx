import React, { useState, useContext, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import NodeRSA from 'node-rsa';
import Api from 'api';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface SalesInfo {
  fileId: number;
  encryptedCid: string;
  price: string;
}

interface SellFileProps {
  visible: boolean;
  fileId: number;
  encryptedCid: string;
  onClose: () => void;
}

const SellFile: React.FC<SellFileProps> = (props: SellFileProps) => {
  const [cid, setCid] = useState('');
  const [contractRsaPublicKey, setContractRsaPublicKey] = useState('');
  const [sellLoading, setSellLoading] = useState(false);

  const [form] = Form.useForm();

  const { account } = useContext(AuthContext);

  useEffect(() => {
    getContractRsaPublicKey();
  }, []);

  const getContractRsaPublicKey = async () => {
    const result = await Api.eos.rpc.get_table_rows({
      json: true,
      code: CONTRACT_ACCOUNT,
      scope: CONTRACT_ACCOUNT,
      table: 'rsa.keys',
      limit: 1,
    });
    setContractRsaPublicKey(result.rows[0].public_key);
  };

  const keyValidator = async (rule, value) => {
    try {
      setCid(new NodeRSA(value).decrypt(props.encryptedCid, 'utf8'));
    } catch (e) {
      setCid('');
      throw new Error('Incorrect RSA private key');
    }
  };

  const encrypt = (string: string, publicKey: string): string => {
    return new NodeRSA(publicKey).encrypt(string, 'base64');
  };

  const sellFile = async (salesInfo: SalesInfo) => {
    setSellLoading(true);
    try {
      const result = await Api.eos.transact(
        {
          actions: [
            {
              account: CONTRACT_ACCOUNT,
              name: 'sellfile',
              authorization: [
                {
                  actor: account.name,
                  permission: account.authority,
                },
              ],
              data: {
                file_id: salesInfo.fileId,
                encrypted_cid: salesInfo.encryptedCid,
                price: salesInfo.price,
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
      message.success('Sell Successfully!');
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      } else {
        message.error(e);
      }
    }
    setSellLoading(false);
  };

  const onFinish = (values) => {
    Modal.confirm({
      title: 'Are you sure to sell it?',
      icon: <ExclamationCircleOutlined />,
      cancelText: 'Not now',
      okText: 'Confirm',
      onOk() {
        sellFile({
          fileId: props.fileId,
          encryptedCid: encrypt(cid, contractRsaPublicKey),
          price: values.price,
        } as SalesInfo).then(() => {
          props.onClose();
        });
      },
    });
  };

  return (
    <Modal
      visible={props.visible}
      title="Sell File"
      width={540}
      okText="Sell"
      okButtonProps={{
        loading: sellLoading,
        disabled: cid === '',
      }}
      cancelText="Cancel"
      onCancel={props.onClose}
      onOk={() => {
        form.submit();
      }}
    >
      <Form form={form} name="sell-file" onFinish={onFinish}>
        <Form.Item
          name="private-key"
          hasFeedback={true}
          rules={[{ required: true, validator: keyValidator }]}
        >
          <Input.TextArea
            placeholder="Please paste your RSA private key here..."
            rows={9}
            style={{
              fontFamily: 'monospace',
            }}
          />
        </Form.Item>

        <Form.Item name="price" rules={[{ required: true }]}>
          <Input placeholder="Please enter the lowest selling price you expect" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SellFile;
