import axios from 'axios';

export interface AppRequestParams {
  keyword?: string;
  category?: string;
  devId?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateAppRequestBody {
  softwareName: string;
  versionNo: string;
  category: string[];
  interfaceLanguage: string;
  supportRom: string[];
  apkFile: any[];
  appInfo: string;

  devId: number;
  createdBy: number;
  // apkName: string;
  // platformId: number;
  // logoPicPath: string;
  // logoLocPath: string;
}

export interface UpdateAppRequestBody {
  versionNo: string;
  versionInfo: string;
  apkFile: any[];
}

export interface UpdateVersionRequestBody {
  versionInfo: string;
}

const appApi = {
  getApps: (params: AppRequestParams): Promise<any> => {
    return axios.get('/app', {
      params: {
        keyword: params.keyword,
        category: params.category,
        devId: params.devId,
        page: params.page - 1,
        size: params.pageSize,
      },
    });
  },

  getUnreviewedApps: (params: AppRequestParams): Promise<any> => {
    return axios.get('/app/unreviewed', {
      params: {
        keyword: params.keyword,
        category: params.category,
        page: params.page - 1,
        size: params.pageSize,
      },
    });
  },

  createApp: (body: CreateAppRequestBody): Promise<any> => {
    console.log(body);
    return axios.post('/app', {
      softwareName: body.softwareName,
      versionNo: body.versionNo,
      category: body.category.join(' / '),
      softwareSize: body.apkFile[0].size / 1048576,
      interfaceLanguage: body.interfaceLanguage,
      supportRom: body.supportRom.join(', '),
      apkName: body.apkFile[0].name,
      appInfo: body.appInfo,
      devId: body.devId,
      createdBy: body.createdBy,
    });
  },

  updateApp: (id: number, body: UpdateAppRequestBody): Promise<any> => {
    console.log(body);
    return axios.post(`/app/${id}/update`, {
      versionNo: body.versionNo,
      versionInfo: body.versionInfo,
      versionSize: body.apkFile[0].size / 1048576,
      apkFileName: body.apkFile[0].name,
    });
  },

  updateVersion: (id: number, body: UpdateVersionRequestBody): Promise<any> => {
    console.log(body);
    return axios.put(`/app/version/${id}`, {
      versionInfo: body.versionInfo,
    });
  },

  onSale: (id: number): Promise<any> => {
    return axios.patch(`/app/${id}/onSale`);
  },

  offSale: (id: number): Promise<any> => {
    return axios.patch(`/app/${id}/offSale`);
  },

  acceptApp: (id: number): Promise<any> => {
    return axios.patch(`/app/${id}/accept`);
  },

  rejectApp: (id: number): Promise<any> => {
    return axios.patch(`/app/${id}/reject`);
  },

  deleteApp: (id: number): Promise<any> => {
    return axios.delete(`/app/${id}`);
  },
};

export default appApi;
