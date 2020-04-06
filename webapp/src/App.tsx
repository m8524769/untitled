import React from 'react';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import en_US from 'antd/es/locale/en_US';
import BasicLayout from './layout/BasicLayout';
import rootStore from 'store/rootStore';
import router from './router/router';
import { AuthProvider } from 'context/AuthContext';

import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={en_US}>
      <Provider {...rootStore}>
        <AuthProvider>
          <BasicLayout>{router}</BasicLayout>
        </AuthProvider>
      </Provider>
    </ConfigProvider>
  );
};

export default App;
