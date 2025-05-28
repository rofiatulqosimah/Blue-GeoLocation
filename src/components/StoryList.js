import { StoryCard } from './StoryCard.js';

export class StoryList {
  constructor() {
    this.storyCard = new StoryCard();
    this.onLoadMore = null;
  }

  setLoadMoreHandler(handler) {
    this.onLoadMore = handler;
  }

  render(stories = [], { showLoadMore = false, isLoading = false } = {}) {
    const storyCards = stories.length
      ? stories
          .map((story) => {
            return this.storyCard.render(story);
          })
          .join('')
      : this.renderEmptyState();

    const renderedContent = `
      <section class="story-list">
        <div class="story-list__header">
          <h2 class="story-list__title">Stories</h2>
          <div class="story-list__actions">
            <a href="#/add" class="button button--primary">
              <i class="fas fa-plus"></i> Share Story
            </a>
          </div>
        </div>
        
        <div class="story-list__grid">
          ${storyCards}
        </div>

        ${showLoadMore ? this.renderLoadMoreButton(isLoading) : ''}
      </section>
    `;

    return renderedContent;
  }

  renderEmptyState() {
    return `
      <div class="story-list__empty">
        <i class="fas fa-book-open"></i>
        <p>No stories found</p>
        <p class="story-list__empty-subtitle">Be the first to share your story!</p>
        <a href="#/add" class="button button--primary">
          <i class="fas fa-plus"></i>
        </a>
      </div>
    `;
  }

  renderLoadMoreButton(isLoading) {
    return `
      <div class="story-list__footer">
        <button class="button button--secondary" id="loadMoreBtn" ${isLoading ? 'disabled' : ''}>
          ${
            isLoading
              ? '<i class="fas fa-spinner fa-spin"></i> Loading...'
              : '<i class="fas fa-sync"></i> Load More'
          }
        </button>
      </div>
    `;
  }

  attachEventListeners(container) {
    if (!container) {
      console.error('Container not found in StoryList attachEventListeners');
      return;
    }

    this.storyCard.attachEventListeners(container);

    const loadMoreBtn = container.querySelector('#loadMoreBtn');
    if (loadMoreBtn && this.onLoadMore) {
      loadMoreBtn.addEventListener('click', this.onLoadMore);
    }
  }

  cleanup() {}
}
