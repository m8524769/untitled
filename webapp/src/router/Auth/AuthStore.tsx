import { observable, action, autorun } from 'mobx';
import BasicStore from '../../store/BasicStore';
import Api from 'api';
// import Api from 'api';

class AuthStoreInitStatus {
  @observable loginModalVisible: boolean = false;

  // @observable isLoggedIn: boolean = false;
  // @observable userId: number = null;
  // @observable userType: string = '';
  // @observable userData: any = {};

  @observable loading: boolean = false;
}

export class AuthStore extends BasicStore<AuthStoreInitStatus> {
  @observable status = new AuthStoreInitStatus();

  @action
  showLoginModal() {
    this.status.loginModalVisible = true;
  }

  @action
  hideLoginModal() {
    this.status.loginModalVisible = false;
  }
}

const authStore = new AuthStore();

autorun(() => {
  const isLoggedIn: boolean = sessionStorage.getItem('isLoggedIn') === 'true';
  const userId: string = sessionStorage.getItem('userId');

  if (userId === null) {
    return;
  }

  if (!isLoggedIn) {
    Api.auth.check(Number(userId)).then((response) => {
      if (response.data === true) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userType', 'developer');
      }
    });
  }
});

export default authStore;
