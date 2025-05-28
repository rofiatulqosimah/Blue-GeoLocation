import { ApiService } from '../services/ApiService.js';

export class StoryModel {
  constructor() {
    this.apiService = new ApiService();
    this.stories = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  async fetchStories(page = 1, size = 10, location = 0) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(
        `${this.baseUrl}/stories?page=${page}&size=${size}&location=${location}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch stories');
      }

      const data = await response.json();

      if (page === 1) {
        this.stories = data.listStory || [];
      } else {
        this.stories = [...this.stories, ...(data.listStory || [])];
      }

      this.currentPage = page;
      return data;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async fetchStoryById(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${this.baseUrl}/stories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch story');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  }

  async addStory(formData) {
    try {
      const endpoint = `${this.baseUrl}/stories${!localStorage.getItem('token') ? '/guest' : ''}`;
      const headers = localStorage.getItem('token')
        ? {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        : {};

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add story');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding story:', error);
      throw error;
    }
  }

  getStories() {
    return this.stories;
  }
}
