import React, { useEffect, useState } from 'react';
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import { Api, JsonRpc } from 'eosjs';
import { message } from 'antd';

ScatterJS.plugins(new ScatterEOS());

const network = ScatterJS.Network.fromJson({
  blockchain: 'eos',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
  host: '127.0.0.1',
  port: 8888,
  protocol: 'http',
});

const rpc = new JsonRpc(network.fullhost());

interface AuthContextType {
  eos: Api;
  account: any;
  login: () => void;
}

export const AuthContext = React.createContext({
  eos: null,
  account: null,
  login: () => {},
} as AuthContextType);

export const AuthProvider = ({ children }) => {
  const [eos, setEos] = useState(null);
  const [account, setAccount] = useState({});

  useEffect(() => {
    login();
  }, []);

  useEffect(() => {
    console.log(eos);
  }, [eos]);

  useEffect(() => {
    console.log(account);
  }, [account]);

  const login = () => {
    ScatterJS.connect('Untitled', { network }).then((connected) => {
      if (!connected) {
        message.warning('You need to launch Scatter Desktop first');
        return;
      }

      setEos(ScatterJS.eos(network, Api, { rpc }));

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

  return (
    <AuthContext.Provider value={{ eos, account, login }}>
      {children}
    </AuthContext.Provider>
  );
};
