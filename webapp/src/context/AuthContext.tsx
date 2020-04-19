import React, { useEffect, useState } from 'react';
import { Api, JsonRpc } from 'eosjs';
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import AnchorLink from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';
import { message } from 'antd';
import { CONTRACT_ACCOUNT, NETWORK } from 'constants/eos';

export declare type WalletType = 'scatter' | 'anchor';

interface Account {
  name?: string;
  authority?: string;
}

interface PermissionLevel {
  actor: string;
  permission: string;
}

interface Action {
  account: string;
  name: string;
  authorization: PermissionLevel[];
  data: {
    [key: string]: any;
  };
}

interface AuthContextType {
  rpc: JsonRpc;
  account: Account;
  login: (wallet: WalletType) => void;
  signout: () => void;
  transact: (action: Action) => Promise<any>;
}

export const AuthContext = React.createContext({} as AuthContextType);

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState<Account>({});
  const [wallet, setWallet] = useState<WalletType>();

  ScatterJS.plugins(new ScatterEOS());
  const network = ScatterJS.Network.fromJson(NETWORK);
  const rpc = new JsonRpc(network.fullhost());
  const eos: Api = ScatterJS.eos(network, Api, { rpc });

  const transport = new AnchorLinkBrowserTransport();
  const link = new AnchorLink({
    transport: transport,
    chainId: NETWORK.chainId,
    rpc: rpc,
  });

  useEffect(() => login('scatter'), []);

  const login = (wallet: WalletType) => {
    switch (wallet) {
      case 'scatter':
        ScatterJS.connect(CONTRACT_ACCOUNT, { network }).then((connected) => {
          if (!connected) {
            message.warning('You need to launch Scatter Desktop first');
            return;
          }
          ScatterJS.login().then((id) => {
            if (!id) {
              message.error('Login Failed');
              return;
            }
            setAccount(ScatterJS.account('eos'));
            setWallet('scatter');
            message.success('Login Successfully!');
          });
        });
        break;

      case 'anchor':
        link.login(CONTRACT_ACCOUNT).then((result) => {
          setAccount({
            name: result.signer.actor,
            authority: result.signer.permission,
          });
          setWallet('anchor');
          message.success('Login Successfully!');
        });
        break;

      default:
        message.error('Unsupported Wallet');
    }
  };

  const signout = () => {
    switch (wallet) {
      case 'scatter':
        ScatterJS.logout().then(() => {
          setAccount({});
          setWallet(undefined);
          message.success('You are signed out');
        });
        break;

      case 'anchor':
        setAccount({});
        setWallet(undefined);
        message.success('You are signed out');
        break;
    }
  };

  const transact = async (action: Action) => {
    switch (wallet) {
      case 'scatter':
        return await eos.transact(
          {
            actions: [action],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          },
        );

      case 'anchor':
        return await link.transact({ action });
    }
  };

  return (
    <AuthContext.Provider value={{ rpc, account, login, signout, transact }}>
      {children}
    </AuthContext.Provider>
  );
};
