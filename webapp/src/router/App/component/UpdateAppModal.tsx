import React from 'react';
import { observer } from 'mobx-react';
import { UploadOutlined } from '@ant-design/icons';
import { Modal, Button, Input, message, Upload, Form } from 'antd';
import Api from 'api';
import appStore from '../AppStore';
import { UpdateAppRequestBody } from 'api/app.api';

@observer
export default class UpdateAppModal extends React.Component<any, any> {
  state = {
    // submittable: true,
  };

  handleFinish = (values) => {
    Modal.confirm({
      title: '确定发布？',
      cancelText: '再等等',
      centered: true,
      onOk() {
        Api.app
          .updateApp(appStore.status.record.id, values as UpdateAppRequestBody)
          .then((response) => {
            message.success('新版本发布成功！');
            appStore.hideCreateAppModal();
          })
          .catch((error) => {
            message.error(`发布失败，原因：${error}`);
          });
      },
    });
  };

  handleCancel = () => {
    appStore.hideUpdateAppModal();
  };

  normFile = (e) => {
    this.props.form.validateFields(['apkFile'], (error, values) => {
      // const isUploaded: boolean = Boolean(!error && e.fileList.length);
    });
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { status } = appStore;
    const { setFieldsValue } = this.props.form;

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
        visible={status.updateAppModalVisible}
        title={`发布新版 ${status.record.softwareName}`}
        mask={false}
        onCancel={this.handleCancel}
        onOk={this.handleFinish}
        okButtonProps={{ disabled: false }}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleFinish}>
            发布
          </Button>,
        ]}
      >
        <Form {...formItemLayout} onFinish={this.handleFinish}>
          <Form.Item
            label="版本号"
            name="versionNo"
            rules={[{ required: true, message: '请填写版本号！' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="APK 文件"
            name="apkFile"
            valuePropName="fileList"
            getValueFromEvent={this.normFile}
            rules={[{ required: true, message: '请上传 APK 文件！' }]}
          >
            <Upload
              name="apkFile"
              accept=".apk"
              action="/api/app/upload"
              method="POST"
              onChange={(info) => {
                if (info.file.response) {
                  const response = info.file.response;
                  console.log(response);
                  setFieldsValue({
                    versionNo: `${response.versionName} (${response.versionCode})`,
                  });
                }
                if (info.fileList.length === 0) {
                  setFieldsValue({
                    versionNo: '',
                  });
                }
              }}
            >
              <Button>
                <UploadOutlined />
                上传 APK 文件
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item label="更新说明" name="versionInfo">
            <Input.TextArea placeholder="要求：不少于 800 字" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
