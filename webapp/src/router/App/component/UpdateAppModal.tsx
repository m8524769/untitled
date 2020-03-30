import React from 'react';
import { observer } from 'mobx-react';
import { Form, Modal, Button, Input, message, Upload, Icon } from 'antd';
import wrapperForm from 'enhancer/wrapperForm';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Api from 'api';
import appStore from '../AppStore';
import { UpdateAppRequestBody } from 'api/app.api';

interface UpdateAppModalProps {
  form?: WrappedFormUtils;
}

@wrapperForm()
@observer
export default class UpdateAppModal extends React.Component<
  UpdateAppModalProps,
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
          title: '确定发布？',
          cancelText: '再等等',
          centered: true,
          onOk() {
            Api.app
              .updateApp(
                appStore.status.record.id,
                values as UpdateAppRequestBody,
              )
              .then((response) => {
                message.success('新版本发布成功！');
                appStore.hideCreateAppModal();
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
    const { getFieldDecorator, setFieldsValue } = this.props.form;

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
        onOk={this.handleSubmit}
        okButtonProps={{ disabled: false }}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSubmit}>
            发布
          </Button>,
        ]}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="版本号">
            {getFieldDecorator('versionNo', {
              rules: [{ required: true, message: '请填写版本号！' }],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="APK 文件">
            {getFieldDecorator('apkFile', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [{ required: true, message: '请上传 APK 文件！' }],
            })(
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
                  <Icon type="upload" />
                  上传 APK 文件
                </Button>
              </Upload>,
            )}
          </Form.Item>

          <Form.Item label="更新说明">
            {getFieldDecorator('versionInfo')(
              <Input.TextArea placeholder="要求：不少于 800 字" />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
