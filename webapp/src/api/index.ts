import Axios from 'axios';
import authApi from './auth.api';
import appApi from './app.api';

Axios.defaults.baseURL = '/api';

const Api = {
  auth: authApi,
  app: appApi,
};

export default Api;
