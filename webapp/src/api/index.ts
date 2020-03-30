import Axios from 'axios';
import authApi from './auth.api';
import appApi from './app.api';
import userApi from './user.api';

Axios.defaults.baseURL = '/api';

const Api = {
  auth: authApi,
  app: appApi,
  user: userApi,
};

export default Api;
