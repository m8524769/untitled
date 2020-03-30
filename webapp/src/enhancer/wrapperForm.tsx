import { Form } from 'antd';
import { FormComponentProps, FormCreateOption } from 'antd/lib/form';

export default function wrapperForm<TOwnProps extends FormComponentProps<any>>(
  options?: FormCreateOption<TOwnProps>,
): any {
  return (Component: React.ComponentType) => Form.create(options)(Component);
}
