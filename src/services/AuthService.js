const API_BASE_URL = 'https://story-api.dicoding.dev/v1';

export class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  async register({ name, email, password }) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to register');
    }

    return response.json();
  }

  async login({ email, password }) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const data = await response.json();
    this.token = data.loginResult.token;
    this.user = {
      id: data.loginResult.userId,
      name: data.loginResult.name,
    };

    localStorage.setItem('token', this.token);
    localStorage.setItem('user', JSON.stringify(this.user));

    return data;
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }
}
