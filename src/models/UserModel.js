import { ApiService } from '../services/ApiService.js';

export class UserModel {
  constructor() {
    this.apiService = new ApiService();
    this.user = null;
    this.isAuthenticated = !!localStorage.getItem('token');
  }

  async login(email, password) {
    try {
      const response = await this.apiService.login(email, password);
      this.user = response.loginResult;
      this.isAuthenticated = true;
      return this.user;
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  }

  async register(name, email, password) {
    try {
      await this.apiService.register(name, email, password);
      return true;
    } catch (error) {
      throw new Error('Registration failed: ' + error.message);
    }
  }

  logout() {
    this.apiService.clearToken();
    this.user = null;
    this.isAuthenticated = false;
  }

  getUser() {
    return this.user;
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }
}
