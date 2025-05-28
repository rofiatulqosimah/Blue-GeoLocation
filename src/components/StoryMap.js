export class StoryMap {
  constructor() {
    this.map = null;
    this.markers = [];
  }

  render() {
    return `
      <div class="story-map">
        <div id="storyMap" class="story-map__container"></div>
      </div>
    `;
  }

  initializeMap(stories = []) {
    if (!stories.length) return;

    
    if (this.map) {
      this.cleanup();
      this.map.remove();
      this.map = null;
    }

    
    this.map = L.map('storyMap').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);

        const popupContent = `
          <div class="story-map__popup">
            ${
              story.photoUrl
                ? `
              <img src="${story.photoUrl}" 
                   alt="${story.name}" 
                   class="story-map__popup-image"
                   loading="lazy">
            `
                : ''
            }
            <div class="story-map__popup-content">
              <h3 class="story-map__popup-title">${story.name || 'Untitled Story'}</h3>
              <p class="story-map__popup-description">${story.description || ''}</p>
              <p class="story-map__popup-coordinates">
                <i class="fas fa-map-marker-alt"></i>
                ${story.lat.toFixed(6)}, ${story.lon.toFixed(6)}
              </p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        this.markers.push(marker);
      }
    });

    
    if (this.markers.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }

    
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  cleanup() {
    
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }

  destroy() {
    this.cleanup();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
