import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

const privateKeys = [
  '5Kf12UAaWo9cdJc1aVsXpvGBo5oXxrhCsk7HTRXCmMXMLNLZqP2',
  '5KBW688zM9SmkWDyrJqbcP7HtXGNaBM6efFbsPTJgGVrj4N9csu',
  '5JVDTxjP6q59gQuohE2EXarw2QwiJqeyAxE8SN3wVrzVpoQ6rgx',
  '5KTmk73RBJ4PTxT8J8qBsAiFpgTS8nnu9pZbYGM1Grtb91zBp7C',
  '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://127.0.0.1:8888');
const eosApi = new Api({ rpc, signatureProvider });

export default eosApi;
