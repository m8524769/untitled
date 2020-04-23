import React from 'react';
import { ConfigProvider } from 'antd';
import en_US from 'antd/es/locale/en_US';
import BasicLayout from './layout/BasicLayout';
import router from './router/router';
import { AuthProvider } from 'context/AuthContext';
import { IpfsProvider } from 'context/IpfsContext';
// import { NETWORK } from 'constants/eos';

// UAL
// import { UALProvider } from 'ual-reactjs-renderer';
// import { Ledger } from 'ual-ledger';
// import { Scatter } from 'ual-scatter';
// import { Anchor } from 'ual-anchor';
// import { Lynx } from 'ual-lynx';
// import { TokenPocket } from 'ual-token-pocket';

import './App.css';

// const appName = 'Untitled';
// const defaultChain = {
//   chainId: NETWORK.chainId,
//   rpcEndpoints: [
//     {
//       protocol: NETWORK.protocol,
//       host: NETWORK.host,
//       port: NETWORK.port,
//     },
//   ],
// };
// const chains = [defaultChain];

// Supported Wallets
// const ledger = new Ledger(chains, { appName });
// const scatter = new Scatter(chains, { appName });
// const anchor = new Anchor(chains, { appName });
// const lynx = new Lynx(chains);
// const tokenPocket = new TokenPocket(chains);

const App: React.FC = () => {
  return (
    <ConfigProvider locale={en_US}>
      <AuthProvider>
        <IpfsProvider>
          <BasicLayout>{router}</BasicLayout>
        </IpfsProvider>
      </AuthProvider>
    </ConfigProvider>
    // <UALProvider
    //   appName={appName}
    //   chains={chains}
    //   authenticators={[ledger, scatter, anchor, lynx, tokenPocket]}
    // />
  );
};

export default App;
