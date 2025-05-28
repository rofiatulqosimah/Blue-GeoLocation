export class AuthPresenter {
  constructor(model, view, router, notificationService) {
    this.model = model;
    this.view = view;
    this.router = router;
    this.notificationService = notificationService;
    this.view.setPresenter(this);
  }

  async login(email, password) {
    try {
      await this.model.login(email, password);

      // Setup notifications after successful login
      try {
        await this.notificationService.requestPermission();
        await this.notificationService.subscribe();
      } catch (error) {
        console.warn('Failed to setup notifications:', error);
      }

      this.view.showSuccess('Login successful!');
      this.router.navigate('/stories');
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async register(name, email, password) {
    try {
      await this.model.register(name, email, password);
      this.view.showSuccess('Registration successful! Please login.');
      setTimeout(() => {
        this.view.setLoginMode(true);
        this.view.render();
      }, 1500);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  logout() {
    try {
      this.model.logout();
      this.notificationService.unsubscribe().catch(console.error);
      this.router.navigate('/login');
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  checkAuth() {
    if (!this.model.isUserAuthenticated()) {
      this.router.navigate('/login');
      return false;
    }
    return true;
  }
}
