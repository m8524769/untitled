import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import fetch from 'node-fetch';
import * as eosConfig from '../../config/eosConfig.json';

const privateKeys = [
  eosConfig.privateKeys.owner,
  eosConfig.privateKeys.active,
];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc(eosConfig.endpoint, { fetch });
const eosApi = new Api({ rpc, signatureProvider });

export default eosApi;
