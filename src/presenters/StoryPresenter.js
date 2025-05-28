export class StoryPresenter {
  constructor(model, view, router) {
    this.model = model;
    this.view = view;
    this.router = router;
    this.view.setPresenter(this);
  }

  async loadStories() {
    try {
      const response = await this.model.fetchStories();

      if (!response || !response.listStory) {
        throw new Error('Invalid response format');
      }

      this.view.render(response.listStory);
      return response.listStory;
    } catch (error) {
      console.error('Error loading stories:', error);
      this.view.handleError(error);
      return [];
    }
  }

  async loadMoreStories() {
    try {
      const nextPage = this.model.currentPage + 1;

      const response = await this.model.fetchStories(nextPage);

      if (!response || !response.listStory) {
        throw new Error('Invalid response format');
      }

      
      return response.listStory;
    } catch (error) {
      console.error('Error loading more stories:', error);
      this.view.handleError(error);
      return [];
    }
  }

  async addStory(formData) {
    try {
      await this.model.addStory(formData);
      this.view.showSuccess('Story shared successfully!');
      setTimeout(() => this.router.navigate('/stories'), 1500);
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async onStoryClick(storyId) {
    try {
      const story = await this.model.fetchStoryById(storyId);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
