import React from 'react';
import { Modal, Form, Input } from 'antd';

export interface TransferInfo {
  to: string;
  quantity: string;
  memo: string;
}

interface TokenTransferProps {
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

const TokenTransfer: React.FC<TokenTransferProps> = (
  props: TokenTransferProps,
) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={props.visible}
      title="Token Transfer"
      confirmLoading={props.transferLoading}
      okText="Confirm Transfer"
      cancelText="Not now"
      onCancel={props.onCancel}
      onOk={() => {
        form.validateFields().then((values: TransferInfo) => {
          props.onConfirm(values);
          form.resetFields();
        });
      }}
    >
      <Form {...formItemLayout} form={form} name="token-transfer">
        <Form.Item label="Transfer to" name="to" rules={[{ required: true }]}>
          <Input placeholder="Account name" />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true }]}
        >
          <Input placeholder={`Maximum: ${props.balance}`} />
        </Form.Item>

        <Form.Item label="Memo" name="memo">
          <Input.TextArea placeholder="Optional" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TokenTransfer;
