import { View } from './View.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export class AddStoryView extends View {
  constructor(containerId) {
    super(containerId);
    this.presenter = null;
    this.map = null;
    this.marker = null;
    this.selectedPosition = null;
    this.mediaStream = null;
    this.popup = null;
    this.mapInitTimeout = null;
  }

  setPresenter(presenter) {
    this.presenter = presenter;
  }

  getTemplate() {
    return `
      <div class="add-story">
        <h2>Share Your Story</h2>
        <form id="addStoryForm" class="add-story-form">
          <div class="form-group">
            <label for="description">Story Description</label>
            <textarea id="description" name="description" placeholder="Share your story here..." required></textarea>
          </div>
          <div class="form-group">
            <label>Photo</label>
            <div class="photo-input-container">
              <div class="photo-buttons">
                <button type="button" class="photo-button" id="chooseFile">
                  <i class="fas fa-file-image"></i> Choose File
                </button>
                <button type="button" class="photo-button" id="useCamera">
                  <i class="fas fa-camera"></i> Use Camera
                </button>
              </div>
              <input type="file" id="photo" name="photo" accept="image/*" hidden required>
              <div class="camera-container" style="display: none;">
                <video id="camera" autoplay playsinline></video>
                <button type="button" class="capture-button" id="capturePhoto">
                  <i class="fas fa-camera"></i> Take Photo
                </button>
                <button type="button" class="cancel-button" id="cancelCamera">
                  <i class="fa-regular fa-circle-xmark"></i>
                </button>
                <canvas id="photoCanvas" style="display: none;"></canvas>
              </div>
              <small class="form-text">Maximum file size: 1MB</small>
              <div id="photoPreview" class="photo-preview"></div>
            </div>
          </div>
          <div class="form-group">
            <label>Location</label>
            <button type="button" id="getCurrentLocation" class="location-button">
              <i class="fas fa-map-marker-alt"></i> Use Current Location
            </button>
            <div id="coordinates" class="coordinates-display"></div>
            <div id="map" class="map-container"></div>
          </div>
          <button type="submit" class="submit-button">
            <i class="fas fa-paper-plane"></i> Share Story
          </button>
        </form>
      </div>
    `;
  }

  initializeMap(mapConfig) {
    if (this.mapInitTimeout) {
      clearTimeout(this.mapInitTimeout);
    }

    const checkContainer = () => {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        console.log('Map container not ready, retrying...');
        return false;
      }

      const containerRect = mapContainer.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.log('Map container has no dimensions, retrying...');
        return false;
      }

      return true;
    };

    const initMap = () => {
      if (!checkContainer()) {
        this.mapInitTimeout = setTimeout(initMap, 100);
        return;
      }

      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      this.map = L.map('map').setView(
        mapConfig.defaultView.center,
        mapConfig.defaultView.zoom
      );

      const streets = L.tileLayer(
        mapConfig.layers.streets.url,
        mapConfig.layers.streets.options
      );

      const satellite = L.tileLayer(
        mapConfig.layers.satellite.url,
        mapConfig.layers.satellite.options
      );

      const baseLayers = {
        'Street View': streets,
        'Satellite View': satellite,
      };

      streets.addTo(this.map);

      L.control
        .layers(baseLayers, null, mapConfig.controls.layers)
        .addTo(this.map);

      this.map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        await this.presenter.handleMapClick(lat, lng);
      });

      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    };

    initMap();
  }

  updateMapMarker(lat, lng, locationInfo) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    if (this.popup) {
      this.popup.remove();
    }

    if (locationInfo) {
      this.popup = L.popup().setLatLng([lat, lng]).setContent(`
          <div class="location-popup">
            <h4>Location Details</h4>
            <p>${locationInfo.display_name}</p>
          </div>
        `);
      this.marker.bindPopup(this.popup).openPopup();
    }

    this.selectedPosition = { lat, lng };
    this.displayCoordinates(lat, lng);
  }

  displayCoordinates(lat, lng) {
    const coordinates = document.getElementById('coordinates');
    coordinates.innerHTML = `
      <i class="fas fa-map-pin"></i>
      Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}
    `;
  }

  setupEventListeners() {
    const form = document.getElementById('addStoryForm');
    const chooseFileBtn = document.getElementById('chooseFile');
    const useCameraBtn = document.getElementById('useCamera');
    const photoInput = document.getElementById('photo');
    const locationBtn = document.getElementById('getCurrentLocation');
    const captureBtn = document.getElementById('capturePhoto');
    const cancelCameraBtn = document.getElementById('cancelCamera');
    const cameraContainer = document.querySelector('.camera-container');
    const video = document.getElementById('camera');

    chooseFileBtn.addEventListener('click', () => {
      this.stopCamera();
      cameraContainer.style.display = 'none';
      photoInput.click();
    });

    useCameraBtn.addEventListener('click', async () => {
      try {
        cameraContainer.style.display = 'block';
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        video.srcObject = this.mediaStream;
      } catch (error) {
        this.showError(
          'Failed to access camera. Please ensure camera permissions are granted.'
        );
        cameraContainer.style.display = 'none';
      }
    });

    locationBtn.addEventListener('click', async () => {
      locationBtn.disabled = true;
      locationBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Getting Location...';

      try {
        const position = await this.presenter.getCurrentPosition();
        const { latitude: lat, longitude: lng } = position.coords;

        this.map.setView([lat, lng], 13);
        await this.presenter.handleMapClick(lat, lng);

        locationBtn.innerHTML =
          '<i class="fas fa-map-marker-alt"></i> Location Updated';
        setTimeout(() => {
          locationBtn.innerHTML =
            '<i class="fas fa-map-marker-alt"></i> Use Current Location';
          locationBtn.disabled = false;
        }, 2000);
      } catch (error) {
        this.showError(
          'Failed to get location. Please try again or select on map.'
        );
        locationBtn.innerHTML =
          '<i class="fas fa-map-marker-alt"></i> Use Current Location';
        locationBtn.disabled = false;
      }
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        const formData = this.getFormData();
        await this.presenter.addStory(formData);
      } catch (error) {
        this.showError(
          error.message || 'Failed to add story. Please try again.'
        );
      }
    });

    captureBtn.addEventListener('click', () => {
      const canvas = document.getElementById('photoCanvas');
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        async (blob) => {
          try {
            const file = new File([blob], 'camera-photo.jpg', {
              type: 'image/jpeg',
              lastModified: new Date().getTime(),
            });

            if (file.size > 1 * 1024 * 1024) {
              this.showError(
                'Photo size should not exceed 1MB. Please try again with a lower resolution.'
              );
              return;
            }

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            photoInput.files = dataTransfer.files;

            this.setupPhotoPreview({ target: { files: [file] } });

            this.stopCamera();
            cameraContainer.style.display = 'none';
          } catch (error) {
            this.showError(
              'Failed to process the captured photo. Please try again.'
            );
            console.error('Error processing captured photo:', error);
          }
        },
        'image/jpeg',
        0.8
      );
    });

    cancelCameraBtn.addEventListener('click', () => {
      this.stopCamera();
      cameraContainer.style.display = 'none';
    });

    photoInput.addEventListener('change', (event) =>
      this.setupPhotoPreview(event)
    );
  }

  getFormData() {
    const form = document.getElementById('addStoryForm');
    const description = form.querySelector('#description').value.trim();
    const photoInput = form.querySelector('#photo');
    const photoFile = photoInput.files[0];

    if (!description) {
      throw new Error('Please enter a description');
    }
    if (!photoFile) {
      throw new Error('Please select or capture a photo');
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photoFile);

    if (this.selectedPosition) {
      formData.append('lat', this.selectedPosition.lat.toString());
      formData.append('lon', this.selectedPosition.lng.toString());
    }

    return formData;
  }

  showError(message) {
    console.error(message);
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  setupPhotoPreview(event) {
    const preview = document.getElementById('photoPreview');
    const file = event.target.files[0];

    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        this.showError('Photo size should not exceed 1MB');
        event.target.value = '';
        preview.innerHTML = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `
                    <div class="preview-container">
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove-photo" title="Remove photo">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

        const removeBtn = preview.querySelector('.remove-photo');
        removeBtn.addEventListener('click', () => {
          event.target.value = '';
          preview.innerHTML = '';
        });
      };
      reader.readAsDataURL(file);
    }
  }

  render() {
    if (!this.container) {
      console.error('Container element not found');
      return;
    }
    this.container.innerHTML = this.getTemplate();
    this.setupEventListeners();
  }

  cleanup() {
    this.stopCamera();
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }
  }
}
