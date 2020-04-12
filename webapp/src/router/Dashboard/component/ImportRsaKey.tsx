import React from 'react';
import { Modal, Form, Input } from 'antd';

export interface TransferInfo {
  to: string;
  quantity: string;
  memo: string;
}

interface ImportRsaKeyProps {
  visible: boolean;
  balance: string;
  transferLoading: boolean;
  onConfirm: (transferInfo: TransferInfo) => void;
  onCancel: () => void;
}

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

const ImportRsaKey: React.FC<ImportRsaKeyProps> = (
  props: ImportRsaKeyProps,
) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={props.visible}
      title="Import RSA Key"
      confirmLoading={props.transferLoading}
      okText="Confirm Transfer"
      cancelText="Not now"
      onCancel={props.onCancel}
      onOk={() => {
        form.validateFields().then((values: TransferInfo) => {
          props.onConfirm(values);
        });
      }}
    >
      <Form {...formItemLayout} form={form} name="rsa-settings">
        <Form.Item label="Your Public Key" name="public-key">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Import RSA Private Key" name="private-key">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ImportRsaKey;
