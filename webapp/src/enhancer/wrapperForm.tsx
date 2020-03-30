import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  FormComponentProps,
  FormCreateOption,
} from '@ant-design/compatible/lib/form';

export default function wrapperForm<TOwnProps extends FormComponentProps<any>>(
  options?: FormCreateOption<TOwnProps>,
): any {
  return (Component: React.ComponentType) => Form.create(options)(Component);
}
