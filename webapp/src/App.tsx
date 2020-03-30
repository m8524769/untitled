import React from 'react';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import BasicLayout from './layout/BasicLayout';
import rootStore from 'store/rootStore';
import router from './router/router';

import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider {...rootStore}>
        <BasicLayout>{router}</BasicLayout>
      </Provider>
    </ConfigProvider>
  );
};

export default App;
