import { API_CONFIG } from '../config/api-config.js';

export class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders(includeAuth = true) {
    const headers = {
      Accept: 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    try {
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('Response handling error:', error);
      throw error;
    }
  }

  async register(name, email, password) {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getHeaders(false),
      },
      body: JSON.stringify({ name, email, password }),
    });

    return this.handleResponse(response);
  }

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getHeaders(false),
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse(response);
    if (data.loginResult?.token) {
      this.setToken(data.loginResult.token);
    }
    return data;
  }

  async addStory(formData) {
    const response = await fetch(`${this.baseUrl}/stories`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  async addGuestStory(formData) {
    const response = await fetch(`${this.baseUrl}/stories/guest`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(false),
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  async getAllStories(page = 1, size = 10, location = 0) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      location: location.toString(),
    });

    const response = await fetch(`${this.baseUrl}/stories?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getStoryById(id) {
    const response = await fetch(`${this.baseUrl}/stories/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async subscribeToNotifications(subscription) {
    const response = await fetch(`${this.baseUrl}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getHeaders(),
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      }),
    });

    return this.handleResponse(response);
  }

  async unsubscribeFromNotifications(endpoint) {
    const response = await fetch(`${this.baseUrl}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.getHeaders(),
      },
      body: JSON.stringify({ endpoint }),
    });

    return this.handleResponse(response);
  }
}
