export class LocationService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org';
  }

  async getLocationInfo(lat, lng) {
    try {
      const response = await fetch(
        `${this.baseUrl}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Blue-GeoLocation/1.0',
            'Accept-Language': 'en-US',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location information');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching location info:', error);
      return null;
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
  }
}
