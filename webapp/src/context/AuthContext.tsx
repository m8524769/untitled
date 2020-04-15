import React, { useEffect, useState } from 'react';
import { Api, JsonRpc } from 'eosjs';
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import { message } from 'antd';
import { NETWORK } from 'constants/eos';

interface AuthContextType {
  eos: Api;
  rpc: JsonRpc;
  account: any;
  login: () => void;
  signout: () => void;
}

export const AuthContext = React.createContext({} as AuthContextType);

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState({});

  ScatterJS.plugins(new ScatterEOS());
  const network = ScatterJS.Network.fromJson(NETWORK);
  const rpc = new JsonRpc(network.fullhost());
  const eos = ScatterJS.eos(network, Api, { rpc });

  useEffect(() => login(), []);

  const login = () => {
    ScatterJS.connect('Untitled', { network }).then((connected) => {
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
        message.success('Login Successfully!');
      });
    });
  };

  const signout = () => {
    ScatterJS.logout().then(() => {
      setAccount({});
      message.success('You are signed out');
    });
  };

  return (
    <AuthContext.Provider value={{ eos, rpc, account, login, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
