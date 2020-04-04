import Axios from 'axios';
import authApi from './auth.api';
import eosApi from './eos.api';

Axios.defaults.baseURL = '/api';

const Api = {
  eos: eosApi,
  auth: authApi,
};

export default Api;
