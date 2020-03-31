import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Button, Input, message, Form } from 'antd';
import Api from 'api';
import authStore from '../AuthStore';
import { LoginRequestBody } from 'api/auth.api';
import { withRouter } from 'react-router-dom';

@observer
class LoginModal extends React.Component<any, any> {
  state = {};

  handleFinish = (values) => {
    Api.auth
      .login(values as LoginRequestBody)
      .then((response) => {
        authStore.hideLoginModal();
        message.success('登录成功！');
        const data = response.data;
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userId', data.user.id);
        sessionStorage.setItem('userType', data.type);
        this.props.history.push(`/app/${data.type}`);
      })
      .catch((error) => {
        message.error(`登录失败，原因：${error}`);
      });
  };

  handleCancel = () => {
    authStore.hideLoginModal();
  };

  render() {
    const { status } = authStore;

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
        visible={status.loginModalVisible}
        title="用户登录"
        onCancel={this.handleCancel}
        onOk={this.handleFinish}
        okButtonProps={{ disabled: false }}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            返回
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleFinish}>
            登录
          </Button>,
        ]}
      >
        <Form {...formItemLayout} onFinish={this.handleFinish}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请填写用户名！' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请填写密码！' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default withRouter(LoginModal);
