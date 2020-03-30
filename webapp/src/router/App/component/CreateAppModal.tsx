import React from 'react';
import { observer } from 'mobx-react';
import { UploadOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Button, Input, Cascader, message, Upload, Select } from 'antd';
import wrapperForm from 'enhancer/wrapperForm';
import { WrappedFormUtils } from '@ant-design/compatible/lib/form/Form';
import Api from 'api';
import { APP_CATEGORIES, LANGUAGES, ANDROID_ROMS } from 'constants/app';
import appStore from '../AppStore';
import { CreateAppRequestBody } from 'api/app.api';

interface CreateAppModalProps {
  form?: WrappedFormUtils;
}

@wrapperForm()
@observer
export default class CreateAppModal extends React.Component<
  CreateAppModalProps,
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
            let createAppRequestBody: CreateAppRequestBody = values;
            const userId = Number(sessionStorage.getItem('userId'));
            createAppRequestBody.devId = userId;
            createAppRequestBody.createdBy = userId;
            Api.app
              .createApp(createAppRequestBody)
              .then((response) => {
                message.success('APP 创建成功！等待审核中。。');
                appStore.hideCreateAppModal();
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
    appStore.hideCreateAppModal();
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
        visible={status.createAppModalVisible}
        title="创建 / 发布新的 APP"
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
          <Form.Item label="应用名称">
            {getFieldDecorator('softwareName', {
              rules: [{ required: true, message: '请填写应用名称！' }],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="版本号">
            {getFieldDecorator('versionNo', {
              rules: [{ required: true, message: '请填写版本号！' }],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="类别">
            {getFieldDecorator('category', {
              rules: [{ required: true, message: '请选择应用类别！' }],
            })(
              <Cascader
                options={APP_CATEGORIES}
                placeholder=""
                changeOnSelect
                showSearch={{ filter }}
              />,
            )}
          </Form.Item>

          <Form.Item label="界面语言">
            {getFieldDecorator('interfaceLanguage', {
              rules: [{ required: true, message: '请选择界面语言！' }],
            })(
              <Select>
                {LANGUAGES.map((language) => (
                  <Select.Option key={language} value={language}>
                    {language}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="支持 ROM">
            {getFieldDecorator('supportRom', {
              initialValue: [],
            })(
              <Select mode="multiple">
                {ANDROID_ROMS.map((rom) => (
                  <Select.Option key={rom} value={rom}>
                    {rom}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="APK 文件">
            {getFieldDecorator('apkFile', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
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
                      softwareName: response.label,
                      versionNo: `${response.versionName} (${response.versionCode})`,
                    });
                  }
                  if (info.fileList.length === 0) {
                    setFieldsValue({
                      softwareName: '',
                      versionNo: '',
                    });
                  }
                }}
              >
                <Button>
                  <UploadOutlined />
                  上传 APK 文件
                </Button>
              </Upload>,
            )}
          </Form.Item>

          <Form.Item label="应用简介">
            {getFieldDecorator('appInfo')(
              <Input.TextArea placeholder="要求：不少于 800 字" />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

function filter(inputValue, path) {
  return path.some(
    (option) =>
      option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  );
}
