import { observable, action } from 'mobx';
import BasicStore from '../../store/BasicStore';

class UserStoreInitStatus {
  @observable createDeveloperModalVisible: boolean = false;
  @observable updateDeveloperModalVisible: boolean = false;

  @observable record: any = {};

  @observable loading: boolean = false;
}

export class UserStore extends BasicStore<UserStoreInitStatus> {
  @observable status = new UserStoreInitStatus();

  @action
  showCreateDeveloperModal() {
    this.status.createDeveloperModalVisible = true;
  }

  @action
  hideCreateDeveloperModal() {
    this.status.createDeveloperModalVisible = false;
  }

  @action
  showUpdateDeveloperModal() {
    this.status.updateDeveloperModalVisible = true;
  }

  @action
  hideUpdateDeveloperModal() {
    this.status.updateDeveloperModalVisible = false;
  }
}

const userStore = new UserStore();
export default userStore;
