export class StoryCard {
  constructor() {
    this.onClick = null;
  }

  setClickHandler(handler) {
    this.onClick = handler;
  }

  render(story) {
    return `
      <article class="story-card" data-story-id="${story.id}">
        <div class="story-card__media">
          ${
            story.photoUrl
              ? `
            <img src="${story.photoUrl}" 
                 alt="${story.name}" 
                 class="story-card__image"
                 loading="lazy">
          `
              : ''
          }
        </div>
        <div class="story-card__content">
          <div class="story-card__header">
            <h3 class="story-card__title">${story.name || 'Untitled Story'}</h3>
            <p class="story-card__date">${new Date(story.createdAt).toLocaleDateString()}</p>
          </div>
          <p class="story-card__description">${story.description || ''}</p>
          ${
            story.lat && story.lon
              ? `
            <p class="story-card__location">
              <i class="fas fa-map-marker-alt"></i>
              ${story.lat.toFixed(6)}, ${story.lon.toFixed(6)}
            </p>
          `
              : ''
          }
        </div>
      </article>
    `;
  }

  attachEventListeners(container) {
    const cards = container.querySelectorAll('.story-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const storyId = card.dataset.storyId;
        if (this.onClick) {
          this.onClick(storyId);
        }
      });
    });
  }
}
