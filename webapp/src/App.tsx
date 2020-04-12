import React from 'react';
import { ConfigProvider } from 'antd';
import en_US from 'antd/es/locale/en_US';
import BasicLayout from './layout/BasicLayout';
import router from './router/router';
import { AuthProvider } from 'context/AuthContext';

import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={en_US}>
      <AuthProvider>
        <BasicLayout>{router}</BasicLayout>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
