import Axios from 'axios';
import authApi from './auth.api';
import appApi from './app.api';
import eosApi from './eos.api';

Axios.defaults.baseURL = '/api';

const Api = {
  eos: eosApi,
  auth: authApi,
  app: appApi,
};

export default Api;
