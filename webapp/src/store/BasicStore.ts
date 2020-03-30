import { action, observable } from 'mobx';

export default class BasicStore<T> {
  @observable status: T;

  @action
  setStatus(object: Partial<T>) {
    const properties = Object.getOwnPropertyNames(object);
    properties.forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(this.status, property)) {
        this.status[property] = object[property];
      }
    });
  }

  @action
  destroyStatus() {
    this.status = null;
  }
}
