import React from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  Modal,
  message,
  PageHeader,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TOKEN_PRECISION, TOKEN_SYMBOL } from 'constants/eos';
import Api from 'api';

const PublishFile: React.FC = () => {
  const onFinish = (values) => {
    console.log(values);
    Modal.confirm({
      title: 'Are you sure to publish it?',
      icon: <ExclamationCircleOutlined />,
      cancelText: 'Not now',
      okText: 'Confirm',
      centered: true,
      async onOk() {
        const result = await Api.eos.transact(
          {
            actions: [
              {
                account: 'eosio.token',
                name: 'transfer',
                authorization: [
                  {
                    actor: 'eosio.token',
                    permission: 'active',
                  },
                ],
                data: {
                  from: 'eosio.token',
                  to: 'yk',
                  quantity: '0.0001 ASS',
                  memo: 'untitled test',
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
      },
    });
  };

  return (
    <PageHeader title="Publish File">
      <Form
        layout="vertical"
        name="publish-file"
        onFinish={onFinish}
        initialValues={{
          price: 0,
        }}
      >
        <Form.Item label="CID" name="cid" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label={`Price (${TOKEN_SYMBOL})`}
          name="price"
          rules={[{ required: true }]}
        >
          <InputNumber
            min={0}
            precision={TOKEN_PRECISION}
            step={1 / Math.pow(10, TOKEN_PRECISION)}
            style={{
              width: '160px',
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Checked & Publish
          </Button>
        </Form.Item>
      </Form>
    </PageHeader>
  );
};

export default PublishFile;
