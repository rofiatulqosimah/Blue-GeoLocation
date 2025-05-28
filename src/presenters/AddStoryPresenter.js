import { LocationService } from '../services/LocationService.js';
import { MapService } from '../services/MapService.js';

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
      window.location.hash = '#/stories';
    } catch (error) {
      this.view.showError(error.message || 'Failed to add story');
    }
  }
}
