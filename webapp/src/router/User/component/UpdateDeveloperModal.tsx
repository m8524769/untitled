import React from 'react';
import { observer } from 'mobx-react';
import { Form, Modal, Button, Input, message } from 'antd';
import wrapperForm from 'enhancer/wrapperForm';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Api from 'api';
import userStore from '../UserStore';
import { UpdateDeveloperRequestBody } from 'api/user.api';

interface UpdateDeveloperModalProps {
  form?: WrappedFormUtils;
}

@wrapperForm()
@observer
export default class UpdateDeveloperModal extends React.Component<
  UpdateDeveloperModalProps,
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
            Api.user
              .updateDeveloper(
                userStore.status.record.id,
                values as UpdateDeveloperRequestBody,
              )
              .then(() => {
                message.success('修改成功！');
                userStore.hideUpdateDeveloperModal();
              })
              .catch((error) => {
                message.error(`修改失败，原因：${error}`);
              });
          },
        });
      }
    });
  };

  handleCancel = () => {
    userStore.hideUpdateDeveloperModal();
  };

  render() {
    const { status } = userStore;
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
        visible={status.updateDeveloperModalVisible}
        title={`修改 ${status.record.devName} 的用户信息`}
        onCancel={this.handleCancel}
        onOk={this.handleSubmit}
        okButtonProps={{ disabled: false }}
        afterClose={() => {
          this.props.form.resetFields();
        }}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.handleSubmit}
            // disabled={!this.state.submittable}
          >
            保存
          </Button>,
        ]}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="修改密码">
            {getFieldDecorator('devPassword', {
              rules: [{ required: true, message: '请填写密码！' }],
              initialValue: status.record.devPassword,
            })(<Input.Password />)}
          </Form.Item>

          <Form.Item label="修改邮箱">
            {getFieldDecorator('devEmail', {
              rules: [{ required: true, message: '请填写邮箱！' }],
              initialValue: status.record.devEmail,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="修改简介">
            {getFieldDecorator('devInfo', {
              initialValue: status.record.devInfo,
            })(<Input.TextArea placeholder="要求：不少于 800 字" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
