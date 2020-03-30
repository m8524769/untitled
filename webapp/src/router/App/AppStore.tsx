import { observable, action } from 'mobx';
import BasicStore from '../../store/BasicStore';

class AppStoreInitStatus {
  @observable createAppModalVisible: boolean = false;
  @observable updateAppModalVisible: boolean = false;
  @observable updateVersionModalVisible: boolean = false;

  // For filters
  @observable softwareNameKeyword: string;
  @observable category: string;
  @observable appStatus: string;

  @observable record: any = {};
  @observable versionRecord: any = {};

  @observable loading: boolean = false;
}

export class AppStore extends BasicStore<AppStoreInitStatus> {
  @observable status = new AppStoreInitStatus();

  @action
  showCreateAppModal() {
    this.status.createAppModalVisible = true;
  }

  @action
  hideCreateAppModal() {
    this.status.createAppModalVisible = false;
  }

  @action
  showUpdateAppModal() {
    this.status.updateAppModalVisible = true;
  }

  @action
  hideUpdateAppModal() {
    this.status.updateAppModalVisible = false;
  }

  @action
  showUpdateVersionModal() {
    this.status.updateVersionModalVisible = true;
  }

  @action
  hideUpdateVersionModal() {
    this.status.updateVersionModalVisible = false;
  }
}

const appStore = new AppStore();
export default appStore;
