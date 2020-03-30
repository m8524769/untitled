import axios from 'axios';

export interface DeveloperRequestParams {
  page?: number;
  pageSize?: number;
}

export interface CreateDeveloperRequestBody {
  devName: string;
  devPassword: string;
  devEmail: string;
  devInfo: string;
}

export interface UpdateDeveloperRequestBody {
  devPassword: string;
  devEmail: string;
  devInfo: string;
}

const userApi = {
  getDevelopers: (params: DeveloperRequestParams): Promise<any> => {
    return axios.get('/user', {
      params: {
        page: params.page - 1,
        size: params.pageSize,
      },
    });
  },

  createDeveloper: (body: CreateDeveloperRequestBody): Promise<any> => {
    return axios.post('/user', {
      devName: body.devName,
      devPassword: body.devPassword,
      devEmail: body.devEmail,
      devInfo: body.devInfo,
    });
  },

  updateDeveloper: (
    id: number,
    body: UpdateDeveloperRequestBody,
  ): Promise<any> => {
    return axios.put(`/user/${id}`, {
      devPassword: body.devPassword,
      devEmail: body.devEmail,
      devInfo: body.devInfo,
    });
  },

  deleteDeveloper: (id: number): Promise<any> => {
    return axios.delete(`/user/${id}`);
  },
};

export default userApi;
