export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = '';

    window.addEventListener('load', () => this.handleRoute());
    window.addEventListener('hashchange', () => this.handleRoute());

    window.addEventListener('hashchange', () => {
      sessionStorage.setItem('lastPath', this.getCurrentPath());
    });
  }

  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  navigate(path) {
    window.location.hash = path;
    sessionStorage.setItem('lastPath', path);
  }

  handleRoute() {
    const path = this.getCurrentPath();

    if (!window.location.hash && sessionStorage.getItem('lastPath')) {
      this.navigate(sessionStorage.getItem('lastPath'));
      return;
    }

    const handler = this.routes.get(path);
    if (handler) {
      this.currentPath = path;
      handler();
    } else {
      this.navigate('/home');
    }
  }

  getCurrentPath() {
    return window.location.hash.slice(1) || '/home';
  }
}
