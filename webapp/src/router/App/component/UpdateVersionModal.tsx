import React from 'react';
import { observer } from 'mobx-react';
import { Form, Modal, Button, Input, message } from 'antd';
import wrapperForm from 'enhancer/wrapperForm';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Api from 'api';
import appStore from '../AppStore';
import { UpdateVersionRequestBody } from 'api/app.api';

interface UpdateVersionModalProps {
  form?: WrappedFormUtils;
}

@wrapperForm()
@observer
export default class UpdateVersionModal extends React.Component<
  UpdateVersionModalProps,
  any
> {
  state = {
    // submittable: true,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
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
      }
    });
  };

  handleCancel = () => {
    appStore.hideUpdateVersionModal();
  };

  render() {
    const { status } = appStore;
    const { getFieldDecorator } = this.props.form;

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
        onOk={this.handleSubmit}
        afterClose={() => {
          this.props.form.resetFields();
        }}
        okButtonProps={{ disabled: false }}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSubmit}>
            保存
          </Button>,
        ]}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="版本说明">
            {getFieldDecorator('versionInfo', {
              initialValue: appStore.status.versionRecord.versionInfo,
            })(<Input.TextArea placeholder="要求：不少于 800 字" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
