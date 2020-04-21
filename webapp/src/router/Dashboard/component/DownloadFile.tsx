import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import NodeRSA from 'node-rsa';

interface DownloadFileProps {
  visible: boolean;
  encryptedCid: string;
  description: string;
  onClose: () => void;
}

const DownloadFile: React.FC<DownloadFileProps> = (
  props: DownloadFileProps,
) => {
  const [cid, setCid] = useState('');

  const [form] = Form.useForm();

  const keyValidator = async (rule, value) => {
    try {
      setCid(new NodeRSA(value).decrypt(props.encryptedCid, 'utf8'));
    } catch (e) {
      setCid('');
      throw new Error('Incorrect RSA private key');
    }
  };

  return (
    <Modal
      visible={props.visible}
      title={`Download ${props.description}`}
      width={540}
      okText="Download"
      okButtonProps={{
        href: `https://ipfs.io/ipfs/${cid}`,
        target: '_blank',
        style: { marginLeft: '8px' },
        disabled: cid === '',
      }}
      cancelText="Cancel"
      onCancel={props.onClose}
      onOk={() => {
        form.validateFields().then(() => {
          props.onClose();
        });
      }}
    >
      <Form form={form} name="check-private-key">
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
      </Form>
    </Modal>
  );
};

export default DownloadFile;
