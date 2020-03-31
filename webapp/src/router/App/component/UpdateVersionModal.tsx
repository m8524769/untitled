import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button, Input, message, Form } from 'antd';
import Api from 'api';
import appStore from '../AppStore';
import { UpdateVersionRequestBody } from 'api/app.api';

@observer
export default class UpdateVersionModal extends React.Component<any, any> {
  state = {
    // submittable: true,
  };

  handleFinish = (values) => {
    Modal.confirm({
      title: '确定修改？',
      cancelText: '不确定',
      centered: true,
      onOk() {
        Api.app
          .updateVersion(
            appStore.status.versionRecord.id,
            values as UpdateVersionRequestBody,
          )
          .then(() => {
            message.success('版本信息修改成功！');
            appStore.hideUpdateVersionModal();
          })
          .catch((error) => {
            message.error(`发布失败，原因：${error}`);
          });
      },
    });
  };

  handleCancel = () => {
    appStore.hideUpdateVersionModal();
  };

  render() {
    const { status } = appStore;

    const formItemLayout = {
      labelCol: {
        xs: { span: 7 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 13 },
        sm: { span: 13 },
      },
    };

    return (
      <Modal
        visible={status.updateVersionModalVisible}
        title={`修改 ${status.versionRecord.versionNo} 版本信息`}
        mask={false}
        onCancel={this.handleCancel}
        onOk={this.handleFinish}
        afterClose={() => {
          this.props.form.resetFields();
        }}
        okButtonProps={{ disabled: false }}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleFinish}>
            保存
          </Button>,
        ]}
      >
        <Form
          {...formItemLayout}
          onFinish={this.handleFinish}
          initialValues={{
            versionInfo: appStore.status.versionRecord.versionInfo,
          }}
        >
          <Form.Item label="版本说明" name="versionInfo">
            <Input.TextArea placeholder="要求：不少于 800 字" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
