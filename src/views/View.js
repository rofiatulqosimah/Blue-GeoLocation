import { Alert } from '../components/Alert.js';

export class View {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.presenter = null;
    this.alert = new Alert();
  }

  setPresenter(presenter) {
    this.presenter = presenter;
  }

  render(data) {
    throw new Error('render() method must be implemented');
  }

  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  showError(message) {
    this.alert.showError(message);
  }

  showSuccess(message) {
    this.alert.showSuccess(message);
  }

  showWarning(message) {
    this.alert.showWarning(message);
  }

  showInfo(message) {
    this.alert.showInfo(message);
  }

  clearMessages() {
    if (this.alert) {
      this.alert.clear();
    }
  }
}
