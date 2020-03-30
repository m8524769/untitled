import React from 'react';
import { observer } from 'mobx-react';
import { Form, Modal, Button, Input, message } from 'antd';
import wrapperForm from 'enhancer/wrapperForm';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Api from 'api';
import userStore from '../UserStore';
import { CreateDeveloperRequestBody } from 'api/user.api';

interface CreateDeveloperModalProps {
  form?: WrappedFormUtils;
}

@wrapperForm()
@observer
export default class CreateDeveloperModal extends React.Component<
  CreateDeveloperModalProps,
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
          title: '确定创建？',
          cancelText: '再想想',
          centered: true,
          onOk() {
            Api.user
              .createDeveloper(values as CreateDeveloperRequestBody)
              .then(() => {
                message.success('添加成功！');
                userStore.hideCreateDeveloperModal();
              })
              .catch((error) => {
                message.error(`创建失败，原因：${error}`);
              });
          },
        });
      }
    });
  };

  handleCancel = () => {
    userStore.hideCreateDeveloperModal();
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
        visible={status.createDeveloperModalVisible}
        title="添加开发者"
        onCancel={this.handleCancel}
        onOk={this.handleSubmit}
        okButtonProps={{ disabled: false }}
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
            创建
          </Button>,
        ]}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="用户名">
            {getFieldDecorator('devName', {
              rules: [{ required: true, message: '请填写用户名！' }],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="密码">
            {getFieldDecorator('devPassword', {
              rules: [{ required: true, message: '请填写密码！' }],
            })(<Input.Password />)}
          </Form.Item>

          <Form.Item label="邮箱">
            {getFieldDecorator('devEmail', {
              rules: [{ required: true, message: '请填写邮箱！' }],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="简介">
            {getFieldDecorator('devInfo')(
              <Input.TextArea placeholder="要求：不少于 800 字" />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
