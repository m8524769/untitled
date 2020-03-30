import React from 'react';

export default function registerTitle(
  title: string,
): <T extends {}>(Component: React.ComponentType<T>) => void {
  return <T extends {}>(
    Component: React.ComponentType<T>,
  ): React.ComponentClass<T> =>
    class RegisterTitleComponent extends React.Component<T> {
      state = {
        initialTitle: document.title,
      };

      componentDidMount(): void {
        document.title = title;
      }

      componentWillUnmount(): void {
        document.title = this.state.initialTitle;
      }

      render(): React.ReactNode {
        return <Component {...this.props} />;
      }
    };
}
