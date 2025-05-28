import { LocationService } from '../services/LocationService.js';
import { MapService } from '../services/MapService.js';
import { saveLocation } from '../utils/db.js';

export class AddStoryPresenter {
  constructor(view, storyModel) {
    this.view = view;
    this.storyModel = storyModel;
    this.locationService = new LocationService();
    this.mapService = new MapService();
  }

  initialize() {
    this.view.setPresenter(this);
    this.setupMap();
  }

  setupMap() {
    const mapConfig = this.mapService.getMapConfig();
    this.view.initializeMap(mapConfig);
  }

  async handleMapClick(lat, lng) {
    try {
      const locationInfo = await this.locationService.getLocationInfo(lat, lng);
      this.view.updateMapMarker(lat, lng, locationInfo);
    } catch (error) {
      this.view.showError('Failed to fetch location information');
    }
  }

  async getCurrentPosition() {
    try {
      const position = await this.locationService.getCurrentPosition();
      return position;
    } catch (error) {
      this.view.showError('Failed to get current location');
      throw error;
    }
  }

  async addStory(formData) {
    try {
      await this.storyModel.addStory(formData);
      // Ambil data yang diperlukan dari formData untuk disimpan ke IndexedDB
      const description = formData.get('description');
      const photo = formData.get('photo');
      const lat = formData.get('lat');
      const lon = formData.get('lon');
      // Konversi foto ke base64 agar bisa disimpan offline
      let photoBase64 = '';
      if (photo) {
        photoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(photo);
        });
      }
      await saveLocation({
        description,
        photo: photoBase64,
        lat,
        lon,
        createdAt: new Date().toISOString(),
      });
      window.location.hash = '#/stories';
    } catch (error) {
      this.view.showError(error.message || 'Failed to add story');
    }
  }
}
