import { View } from './View.js';
import { StoryList } from '../components/StoryList.js';
import { StoryMap } from '../components/StoryMap.js';

export class StoryListView extends View {
  constructor(containerId) {
    super(containerId);
    this.storyList = new StoryList();
    this.storyMap = new StoryMap();
    this.presenter = null;
    this.isLoading = false;
    this.mapService = null;
    this.initializedMaps = new Set();
    this.cleanupTimeout = null;
    this.loadMoreHandler = null;
    this.allStories = []; 
  }

  setPresenter(presenter) {
    this.presenter = presenter;
    this.loadMoreHandler = () => this.handleLoadMore();
    this.storyList.setLoadMoreHandler(this.loadMoreHandler);
  }

  setMapService(mapService) {
    this.mapService = mapService;
  }

  async handleLoadMore() {
    if (this.isLoading || !this.presenter) return;

    try {
      this.isLoading = true;
      this.updateLoadMoreState(true);
      const newStories = await this.presenter.loadMoreStories();

      if (newStories && newStories.length > 0) {
        
        this.allStories = [...this.allStories, ...newStories];

        
        this.render(this.allStories);
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading = false;
      this.updateLoadMoreState(false);
    }
  }

  updateLoadMoreState(isLoading) {
    const loadMoreBtn = this.container.querySelector('#loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.innerHTML = isLoading
        ? '<i class="fas fa-spinner fa-spin"></i> Loading...'
        : '<i class="fas fa-sync"></i> Load More';
      loadMoreBtn.disabled = isLoading;
    }
  }

  updateMap(stories) {
    this.storyMap.initializeMap(stories);
  }

  initializeMaps(stories) {
    
    if (this.cleanupTimeout) {
      clearTimeout(this.cleanupTimeout);
    }

    
    this.updateMap(stories);

    
    this.cleanupTimeout = setTimeout(() => {
      this.cleanup();
    }, 300000); 
  }

  cleanup() {
    
    if (this.cleanupTimeout) {
      clearTimeout(this.cleanupTimeout);
      this.cleanupTimeout = null;
    }

    
    if (this.mapService) {
      this.mapService.cleanupMiniMaps();
      this.initializedMaps.clear();
    }

    
    this.storyMap.cleanup();

    
    if (this.storyList) {
      this.storyList.cleanup?.();
    }

    
    this.isLoading = false;
  }

  render(stories = []) {
    if (!this.container) {
      console.error('Container not found in StoryListView');
      return;
    }

    try {
      if (!localStorage.getItem('token')) {
        this.cleanup();
        this.showWarning(
          'Authentication required. Please <a href="#/login">login</a> or <a href="#/register">register</a> to view stories.'
        );
        this.container.innerHTML = this.storyList.render([], {
          showLoadMore: false,
          isLoading: false,
        });
        return;
      }

      
      this.allStories = stories;

      
      if (this.mapService) {
        this.mapService.cleanupMiniMaps();
      }
      this.initializedMaps.clear();

      
      const renderedContent = `
        ${this.storyMap.render()}
        ${this.storyList.render(stories, {
          showLoadMore: stories.length >= 10,
          isLoading: this.isLoading,
        })}
      `;

      this.container.innerHTML = renderedContent;

      
      if (this.loadMoreHandler) {
        this.storyList.setLoadMoreHandler(this.loadMoreHandler);
      }
      this.storyList.attachEventListeners(this.container);

      
      this.initializeMaps(stories);
    } catch (error) {
      console.error('Error in StoryListView render:', error);
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error('Handling error in StoryListView:', error);
    if (error.message.includes('Authentication required')) {
      this.showWarning(
        'Authentication required. Please <a href="#/login">login</a> or <a href="#/register">register</a> to view stories.'
      );
      this.container.innerHTML = this.storyList.render([], {
        showLoadMore: false,
        isLoading: false,
      });
    } else {
      this.showError(
        error.message || 'An error occurred while loading stories'
      );
    }
  }
}
