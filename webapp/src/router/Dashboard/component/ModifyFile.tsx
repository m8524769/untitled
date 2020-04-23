import React, { useState, useContext, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { CONTRACT_ACCOUNT } from 'constants/eos';
import { AuthContext } from 'context/AuthContext';
import { RpcError } from 'eosjs';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import usePrevious from 'hooks/usePrevious';

interface ModifyInfo {
  fileId: number;
  description: string;
  price: string;
}

interface ModifyFileProps {
  visible: boolean;
  fileId: number;
  description: string;
  price: string;
  onClose: () => void;
}

const ModifyFile: React.FC<ModifyFileProps> = (props: ModifyFileProps) => {
  const [modifyLoading, setModifyLoading] = useState(false);

  const [form] = Form.useForm();

  const { account, transact } = useContext(AuthContext);

  const prevFileId = usePrevious(props.fileId);
  useEffect(() => {
    if (props.visible && prevFileId) {
      form.resetFields();
    }
  }, [props.fileId]);

  const modifyFile = async (modifyInfo: ModifyInfo) => {
    setModifyLoading(true);
    try {
      await transact({
        account: CONTRACT_ACCOUNT,
        name: 'modifyfile',
        authorization: [
          {
            actor: account.name,
            permission: account.authority,
          },
        ],
        data: {
          file_id: modifyInfo.fileId,
          description: modifyInfo.description,
          price: modifyInfo.price,
        },
      });
      message.success('Modify Successfully!');
    } catch (e) {
      if (e instanceof RpcError) {
        message.error(JSON.stringify(e.json, null, 2));
      }
      console.error(e);
    }
    setModifyLoading(false);
  };

  const onFinish = (values) => {
    Modal.confirm({
      title: 'Are you sure to modify it?',
      icon: <ExclamationCircleOutlined />,
      cancelText: 'Not now',
      okText: 'Confirm',
      onOk() {
        modifyFile({
          fileId: props.fileId,
          description: values.description,
          price: values.price,
        } as ModifyInfo).then(() => {
          props.onClose();
        });
      },
    });
  };

  return (
    <Modal
      visible={props.visible}
      title={`Modify ${props.description}`}
      okText="Modify"
      okButtonProps={{
        loading: modifyLoading,
      }}
      cancelText="Cancel"
      onCancel={props.onClose}
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        layout="vertical"
        form={form}
        name="modify-file"
        onFinish={onFinish}
        initialValues={{
          description: props.description,
          price: props.price,
        }}
      >
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea placeholder="Should include the file name" />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <Input placeholder="Please enter the lowest selling price you expect" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModifyFile;
