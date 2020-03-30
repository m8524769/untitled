import axios from 'axios';

export interface LoginRequestBody {
  username: string;
  password: string;
}

const authApi = {
  login: (body: LoginRequestBody): Promise<any> => {
    return axios.post('/user/login', {
      username: body.username,
      password: body.password,
    });
  },

  check: (id: number): Promise<any> => {
    return axios.get(`/user/${id}/check`);
  },

  logout: (id: number): Promise<any> => {
    return axios.get(`/user/${id}/logout`);
  },
};

export default authApi;
