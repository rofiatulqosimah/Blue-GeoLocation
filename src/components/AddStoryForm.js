export class AddStoryForm {
  render() {
    return `
            <section class="add-story fade-in">
                <h2>Add New Story</h2>
                <form id="add-story-form">
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" required placeholder="Share your story..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="photo">Photo</label>
                        <input type="file" id="photo" accept="image/*" required>
                        <small class="form-text">Maximum file size: 1MB</small>
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <div id="map" class="map-container"></div>
                        <div class="location-controls">
                            <button type="button" id="get-location" class="location-button">
                                <i class="fas fa-map-marker-alt"></i> Get Current Location
                            </button>
                            <div id="location-status" class="location-status"></div>
                        </div>
                    </div>
                    <button type="submit" class="submit-button">
                        <i class="fas fa-share"></i> Share Story
                    </button>
                </form>
            </section>
        `;
  }

  setupForm(mapService) {
    const form = document.getElementById('add-story-form');
    const getLocationButton = document.getElementById('get-location');
    const locationStatus = document.getElementById('location-status');
    const photoInput = document.getElementById('photo');

    this.setupPhotoPreview(photoInput);
    this.setupLocationButton(getLocationButton, locationStatus);

    // Initialize map
    mapService.initializeMap('map').catch((error) => {
      console.error('Failed to initialize map:', error);
      locationStatus.innerHTML =
        '<span class="error">Failed to load map. Please refresh the page.</span>';
    });
  }

  setupPhotoPreview(photoInput) {
    const photoPreview = document.createElement('img');
    photoPreview.style.display = 'none';
    photoPreview.style.maxWidth = '100%';
    photoPreview.style.marginTop = '10px';
    photoInput.parentNode.insertBefore(photoPreview, photoInput.nextSibling);

    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 1024 * 1024) {
          // 1MB
          alert('Photo size must be less than 1MB');
          photoInput.value = '';
          photoPreview.style.display = 'none';
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          photoPreview.src = e.target.result;
          photoPreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        photoPreview.style.display = 'none';
      }
    });
  }

  setupLocationButton(getLocationButton, locationStatus) {
    getLocationButton.addEventListener('click', async () => {
      if (!navigator.geolocation) {
        locationStatus.innerHTML =
          '<span class="error">Geolocation is not supported by your browser</span>';
        return;
      }

      getLocationButton.disabled = true;
      getLocationButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Getting location...';
      locationStatus.innerHTML = '';

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        locationStatus.innerHTML =
          '<span class="success">Location acquired!</span>';
      } catch (error) {
        locationStatus.innerHTML =
          '<span class="error">Failed to get location</span>';
      } finally {
        getLocationButton.disabled = false;
        getLocationButton.innerHTML =
          '<i class="fas fa-map-marker-alt"></i> Get Current Location';
      }
    });
  }
}
