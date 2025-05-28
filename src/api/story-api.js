const API_BASE_URL = 'https://story-api.dicoding.dev/v1';

export class StoryAPI {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
    this.token = localStorage.getItem('token');
  }

  async getAllStories() {
    try {
      const response = await fetch(`${this.baseUrl}/stories`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stories');
      }

      return data.listStory || [];
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async addStory(formData) {
    try {
      // Determine if we should use guest or authenticated endpoint
      const endpoint = this.token ? '/stories' : '/stories/guest';
      const headers = this.token
        ? { Authorization: `Bearer ${this.token}` }
        : {};

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add story');
      }

      return data;
    } catch (error) {
      console.error('Error adding story:', error);
      throw error;
    }
  }

  async getStoryDetail(id) {
    try {
      const response = await fetch(`${this.baseUrl}/stories/${id}`, {
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : '',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch story detail');
      }

      return data.story;
    } catch (error) {
      console.error('Error fetching story detail:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      this.token = data.loginResult.token;
      localStorage.setItem('token', this.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(name, email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }
}
