import appStore from 'router/App/AppStore';
import authStore from 'router/Auth/AuthStore';
import userStore from 'router/User/UserStore';

const rootStore = {
  appStore: appStore,
  authStore: authStore,
  userStore: userStore,
};

export default rootStore;
